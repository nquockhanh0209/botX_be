import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class CsvService {
  async exportDataToCsv(data: any[], headers: string[], filePath: string): Promise<void> {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers.map((header) => ({ id: header, title: header })),
    });

    await csvWriter.writeRecords(data);
  }
}
