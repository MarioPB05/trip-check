import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '@core/services/database.service';
import { Template } from '@core/models/template.model';
import { EmojiService } from '@core/services/emoji.service';

@Injectable({ providedIn: 'root' })
export class TemplateRepository {
  private readonly db = inject(DatabaseService);
  private readonly emojiService = inject(EmojiService);

  formatDBResultToTemplates(rows: any[]): Template[] {
    const templatesMap: { [key: number]: Template } = {};

    rows.forEach((row) => {
      const templateId = row['id'];

      if (!templatesMap[templateId]) {
        templatesMap[templateId] = {
          id: templateId,
          name: row['name'],
          items: [],
          deleted: row['deleted'] === 1,
        };
      }

      if (row['item_id']) {
        templatesMap[templateId].items.push({
          quantity: row['item_quantity'],
          item: {
            id: row['item_id'],
            name: row['item_name'],
            emojiUrl: this.emojiService.getEmojiUrl(row['item_emoji']),
            deleted: false,
          },
        });
      }
    });

    return Object.values(templatesMap);
  }

  async createTemplate(name: string): Promise<number | null> {
    return this.db.withConn(async (conn) => {
      const res = await conn.run('INSERT INTO template (name) VALUES (?)', [name]);
      return res.changes?.lastId || null;
    });
  }

  async addItemToTemplate(templateId: number, itemId: number, quantity: number): Promise<void> {
    await this.db.withConn(async (conn) => {
      await conn.run(
        'INSERT INTO template_item (template_id, item_id, quantity) VALUES (?, ?, ?)',
        [templateId, itemId, quantity],
      );
    });
  }

  async getAllTemplates(): Promise<any[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(`
        SELECT t.id, t.name, t.deleted, i.id as item_id, i.name as item_name, i.emoji as item_emoji, ti.quantity as item_quantity
        FROM template t
        LEFT JOIN template_item ti on t.id = ti.template_id
        LEFT JOIN item i on ti.item_id = i.id and i.deleted = 0
        WHERE t.deleted = 0
        ORDER BY t.id
      `);

      return this.formatDBResultToTemplates(res.values || []);
    });
  }
}
