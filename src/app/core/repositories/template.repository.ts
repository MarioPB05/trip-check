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

  async getAllTemplates(): Promise<any[]> {
    return this.db.withConn(async (conn) => {
      const res = await conn.query(`
        SELECT t.id, t.name, t.deleted, i.id as item_id, i.name as item_name, i.emoji as item_emoji, ti.quantity as item_quantity
        FROM template t
        LEFT JOIN template_item ti on t.id = ti.template_id
        LEFT JOIN item i on ti.item_id = i.id and i.deleted = 0
        WHERE t.deleted = 0
        ORDER BY t.id DESC
      `);

      return this.formatDBResultToTemplates(res.values || []);
    });
  }

  async getTemplateById(id: number): Promise<Template | null> {
    return await this.db.withConn(async (conn) => {
      const res = await conn.query(
        `
        SELECT t.id, t.name, t.deleted, i.id as item_id, i.name as item_name, i.emoji as item_emoji, ti.quantity as item_quantity
        FROM template t
        LEFT JOIN template_item ti on t.id = ti.template_id
        LEFT JOIN item i on ti.item_id = i.id and i.deleted = 0
        WHERE t.deleted = 0 AND t.id = ?
      `,
        [id],
      );

      return this.formatDBResultToTemplates(res.values || [])[0] || null;
    });
  }

  async getItemsByTemplateId(templateId: number): Promise<{ itemId: number; quantity: number }[]> {
    return await this.db.withConn(async (conn) => {
      const res = await conn.query(
        'SELECT item_id, quantity FROM template_item WHERE template_id = ?',
        [templateId],
      );

      return (
        res.values?.map((row) => ({
          itemId: row['item_id'],
          quantity: row['quantity'],
        })) || []
      );
    });
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

  async removeItemFromTemplate(templateId: number, itemId: number): Promise<void> {
    await this.db.withConn(async (conn) => {
      await conn.run('DELETE FROM template_item WHERE template_id = ? AND item_id = ?', [
        templateId,
        itemId,
      ]);
    });
  }

  async removeAllItemsFromTemplate(templateId: number): Promise<void> {
    await this.db.withConn(async (conn) => {
      await conn.run('DELETE FROM template_item WHERE template_id = ?', [templateId]);
    });
  }

  async updateTemplateName(templateId: number, name: string) {
    await this.db.withConn(async (conn) => {
      await conn.run('UPDATE template SET name = ? WHERE id = ?', [name, templateId]);
    });
  }

  updateItemQuantity(templateId: number, itemId: number, quantity: number) {
    return this.db.withConn(async (conn) => {
      await conn.run(
        'UPDATE template_item SET quantity = ? WHERE template_id = ? AND item_id = ?',
        [quantity, templateId, itemId],
      );
    });
  }
}
