import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '@core/services/database.service';
import { CurrentTripDetails, Trip } from '@core/models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripRepository {
  private readonly db = inject(DatabaseService);

  formatDBRowToTrip(row: any): Trip {
    return {
      id: row['id'],
      name: row['name'],
      destination: row['destination'],
      status: row['status'],
      travelers: row['travelers'],
      startDate: row['trip_start_date'],
      endDate: row['trip_end_date'],
    };
  }

  formatDBRowToCurrentTripDetails(row: any): CurrentTripDetails {
    return {
      id: row['id'],
      name: row['name'],
      destination: row['destination'],
      status: row['status'],
      travelers: row['travelers'],
      startDate: row['trip_start_date'],
      endDate: row['trip_end_date'],
      numberOfLocations: row['number_of_locations'],
      numberOfItems: row['number_of_items'],
    };
  }

  async addTrip(trip: Trip): Promise<void> {
    await this.db.withConn(async (conn) => {
      await conn.run(
        'INSERT INTO trip (name, destination, status, travelers, trip_start_date, trip_end_date) VALUES (?, ?, ?, ?, ?, ?)',
        [trip.name, trip.destination, trip.status, trip.travelers, trip.startDate, trip.endDate],
      );
    });
  }

  async getAllCurrentTrips(): Promise<CurrentTripDetails[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(`
        SELECT
          t.*,
          COUNT(DISTINCT l.id) AS number_of_locations,
          COUNT(i.id) AS number_of_items
        FROM trip t
        LEFT JOIN location l ON l.trip_id = t.id
        LEFT JOIN location_item i ON i.start_location_id = l.id
        WHERE t.status = 1
        GROUP BY t.id
        ORDER BY t.trip_end_date DESC
      `);

      console.log(res.values);

      return (
        (res.values?.map((row) =>
          this.formatDBRowToCurrentTripDetails(row),
        ) as CurrentTripDetails[]) || []
      );
    });
  }

  async getAllPastTrips(): Promise<Trip[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(
        'SELECT * FROM trip WHERE status = 2 ORDER BY trip_end_date DESC',
      );

      return (res.values?.map((row) => this.formatDBRowToTrip(row)) as Trip[]) || [];
    });
  }

  async getAllFutureTrips(): Promise<Trip[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(
        'SELECT * FROM trip WHERE status = 0 ORDER BY trip_end_date DESC',
      );

      return (res.values?.map((row) => this.formatDBRowToTrip(row)) as Trip[]) || [];
    });
  }
}
