import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '@core/services/database.service';
import { Item, ItemWithUsages } from '@core/models/item.model';
import { EmojiService } from '@core/services/emoji.service';
import { TripStatus } from '@core/models/trip.model';

@Injectable({ providedIn: 'root' })
export class ItemRepository {
  private readonly db = inject(DatabaseService);
  private readonly emojiService = inject(EmojiService);

  formatDBRowToItem(row: any): Item {
    return {
      id: row['id'],
      name: row['name'],
      emojiUrl: this.emojiService.getEmojiUrl(row['emoji']),
      deleted: row['deleted'] === 1,
    };
  }

  formatDBRowToItemWithUsages(row: any): ItemWithUsages {
    return {
      id: row['id'],
      name: row['name'],
      emojiUrl: this.emojiService.getEmojiUrl(row['emoji']),
      deleted: row['deleted'] === 1,
      timesUsed: row['times_used'],
    };
  }

  getAllItems(): Promise<ItemWithUsages[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(`
        SELECT i.id, i.name, i.emoji, i.deleted, COALESCE(u.times_used, 0) AS times_used
        FROM item AS i
        LEFT JOIN (
          SELECT item_id, COUNT(*) AS times_used
          FROM trip AS t
          JOIN location AS l ON l.trip_id = t.id
          JOIN location_item AS li ON li.start_location_id = l.id OR li.end_location_id = l.id
          WHERE t.status = 2
          GROUP BY item_id
        ) u ON u.item_id = i.id
        WHERE i.deleted = 0
        ORDER BY times_used DESC, i.name
      `);

      return res.values?.map((row) => this.formatDBRowToItemWithUsages(row)) || [];
    });
  }

  getItemsFilteredAndPaginated(searchTerm: string, limit: number, offset: number): Promise<Item[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(
        `
        SELECT i.id, i.name, i.emoji, i.deleted
        FROM item AS i
        WHERE i.deleted = 0 AND i.name LIKE ?
        ORDER BY i.name
        LIMIT ? OFFSET ?
      `,
        [`%${searchTerm}%`, limit, offset],
      );

      return res.values?.map((row) => this.formatDBRowToItem(row)) || [];
    });
  }

  getItemById(itemId: number): Promise<Item | null> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(
        `
        SELECT id, name, emoji, deleted
        FROM item
        WHERE id = ? AND deleted = 0
      `,
        [itemId],
      );

      if (res.values && res.values.length > 0) {
        return this.formatDBRowToItem(res.values[0]);
      } else {
        return null;
      }
    });
  }

  /**
   * Suma las unidades de un objeto que se llevaron en los viajes ya finalizados
   * del año en curso.
   *
   * El año de un viaje se determina por su fecha de inicio, no por la de fin: un
   * viaje del 28 de diciembre al 4 de enero cuenta en el año en que empezó.
   *
   * El año actual se obtiene con `'now'`, que en SQLite trabaja en UTC. En zonas
   * horarias por delante de UTC, la primera madrugada del 1 de enero devolverá
   * todavía el año anterior; se acepta por tratarse de un caso extremo.
   *
   * La unión con `trip` va sólo por `start_location_id` porque las dos
   * ubicaciones de una fila pertenecen siempre al mismo viaje. Unir por ambas
   * duplicaría las filas cuyo origen y destino son ubicaciones distintas.
   *
   * @param itemId - El id del objeto.
   * @returns Las unidades totales, o 0 si ningún viaje cumple los filtros.
   */
  getTotalQuantityThisYearInCompletedTrips(itemId: number): Promise<number> {
    return this.db.querySingleValue({
      sql: `
          SELECT COALESCE(SUM(quantity), 0) AS total_quantity
          FROM location_item AS li
          JOIN location AS l ON l.id = li.start_location_id
          JOIN trip AS t ON t.id = l.trip_id
          WHERE li.item_id = ?
          AND t.status = ? AND strftime('%Y', t.trip_start_date) = strftime('%Y', 'now')
          `,
      values: [itemId, TripStatus.Completed],
      column: 'total_quantity',
      fallbackValue: 0,
    });
  }

  /**
   * Suma las unidades que se han perdido de un objeto en viajes en curso o ya finalizados.
   *
   * Tiene en cuenta los viajes de todos los años independientemente de la fecha de inicio,
   * únicamente se filtra por el estado actual del viaje que debe ser o en curso o finalizado.
   *
   * El filtro por el estado del viaje es una protección adicional pero necesaria ya que por
   * lógica de negocio un viaje planificado o cancelado no debería permitir escribir esa columna.
   *
   * @param itemId - El id del objeto.
   * @returns Las unidades totales que se han perdido, o 0 si no se ha perdido ninguna.
   */
  getLostQuantityInOngoingOrCompletedTrips(itemId: number): Promise<number> {
    return this.db.querySingleValue({
      sql: `
          SELECT COALESCE(SUM(lost), 0) AS lost_quantity
          FROM location_item AS li
          JOIN location AS l ON l.id = li.start_location_id
          JOIN trip AS t ON t.id = l.trip_id
          WHERE li.item_id = ?
          AND t.status IN (?,?)
          `,
      values: [itemId, TripStatus.Ongoing, TripStatus.Completed],
      column: 'lost_quantity',
      fallbackValue: 0,
    });
  }

  /**
   * Cuenta la cantidad de viajes completados en los que se llevó un objeto determinado.
   *
   * Si un objeto se llevó varias veces en un mismo viaje pero en distintas ubicaciones, se cuenta como un único viaje.
   * Si quitásemos el `DISTINCT` del `COUNT`, se contaría cada ubicación como un viaje distinto, lo cual no es correcto.
   *
   * @param itemId - El id del objeto.
   * @returns La cantidad de viajes completados en los que se llevaron dicho objeto.
   */
  getCompletedTripsCountWithItem(itemId: number): Promise<number> {
    return this.db.querySingleValue({
      sql: `
          SELECT COUNT(DISTINCT t.id) AS trips_count
          FROM location_item AS li
          JOIN location AS l ON l.id = li.start_location_id
          JOIN trip AS t ON t.id = l.trip_id
          WHERE li.item_id = ?
          AND t.status = ?;
          `,
      values: [itemId, TripStatus.Completed],
      column: 'trips_count',
      fallbackValue: 0,
    });
  }

  /**
   * Devuelve el puesto que ocupa un objeto al ordenar todos los objetos por las
   * unidades llevadas en los viajes completados del año en curso, de mayor a menor.
   *
   * La medida del ranking es la misma que calcula
   * `getTotalQuantityThisYearInCompletedTrips`, agrupada por objeto en lugar de
   * filtrada por uno: el criterio del año por fecha de inicio y la salvedad de
   * `'now'` en UTC son los que allí se explican.
   *
   * La numeración se hace sobre todos los objetos y el objeto buscado se selecciona
   * después, en la consulta exterior. Filtrarlo antes de numerar dejaría una sola
   * fila en el ranking y el puesto sería siempre 1.
   *
   * Se usa `ROW_NUMBER()` y no `RANK()`: dos objetos con la misma cantidad reciben
   * puestos distintos, decididos por orden alfabético. Se acepta ese desempate
   * arbitrario para no mostrar nunca puestos compartidos, que en una tarjeta que se
   * ve aislada, sin el ranking al lado, no se entienden.
   *
   * Quedan fuera los objetos que suman 0 unidades, porque un puesto entre objetos
   * que nunca se metieron en la maleta no informa de nada, y los borrados, porque
   * al competir empujarían al objeto hacia abajo y mostrarían un puesto peor que el
   * que le corresponde entre los objetos activos.
   *
   * @param itemId - El id del objeto.
   * @returns El puesto en el ranking, o 0 si el objeto no tiene puesto: no existe un
   * puesto 0, así que ese valor señala la ausencia de datos.
   */
  getRankingPositionByTotalQuantityThisYear(itemId: number): Promise<number> {
    return this.db.querySingleValue({
      sql: `
          SELECT rank_position
          FROM (
            SELECT li.item_id, ROW_NUMBER() OVER (ORDER BY SUM(quantity) DESC, i.name ASC) AS rank_position
            FROM location_item AS li
            JOIN location AS l ON l.id = li.start_location_id
            JOIN trip AS t ON t.id = l.trip_id
            JOIN item AS i ON i.id = li.item_id
            WHERE t.status = ? AND strftime('%Y', t.trip_start_date) = strftime('%Y', 'now') AND i.deleted = 0
            GROUP BY li.item_id HAVING SUM(quantity) > 0
          ) AS ranked_items
          WHERE ranked_items.item_id = ?;
          `,
      values: [TripStatus.Completed, itemId],
      column: 'rank_position',
      fallbackValue: 0,
    });
  }
}
