import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '@core/services/database.service';
import { Item } from '@core/models/item.model';
import { EmojiService } from '@core/services/emoji.service';

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

  getAllItemsUsed(): Promise<Item[]> {
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
        WHERE u.times_used IS NOT NULL AND i.deleted = 0
        ORDER BY times_used DESC, i.name
      `);

      return res.values?.map((row) => this.formatDBRowToItem(row)) || [];
    });
  }

  getAllItemsNotUsed(): Promise<Item[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(`
        SELECT i.id, i.name, i.emoji, i.deleted
        FROM item AS i
        LEFT JOIN (
          SELECT DISTINCT li.item_id
          FROM trip AS t
          JOIN location AS l ON l.trip_id = t.id
          JOIN location_item AS li ON li.start_location_id = l.id OR li.end_location_id = l.id
          WHERE t.status = 2
        ) u ON u.item_id = i.id
        WHERE u.item_id IS NULL AND i.deleted = 0
        ORDER BY i.name
      `);

      return res.values?.map((row) => this.formatDBRowToItem(row)) || [];
    });
  }
}
