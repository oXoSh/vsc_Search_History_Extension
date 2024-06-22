import * as vscode from 'vscode';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';

import { ISearchHistoryValues } from './searchHistoryService';

export function getSearchHistory(dbPath: string): ISearchHistoryValues | undefined {
    const SEARCH_HISTORY_KEY = 'workbench.search.history';
    const TABLE_NAME = 'ItemTable';
    const query = `SELECT value FROM ${TABLE_NAME} WHERE key = ?`;
    let historyValue: ISearchHistoryValues | undefined;

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err: any) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the vsc database.');
    });

    db.get(query, [SEARCH_HISTORY_KEY], (err: any, raw: any) => {
        if (err) {
            throw err;
        }
        if (raw) {
            try {
                historyValue = JSON.parse(raw.value);
            } catch (e) {
                // Invalid data
                return undefined;
            }
            console.log(`Value for '${SEARCH_HISTORY_KEY}':`, historyValue);
            vscode.window.showInformationMessage(`Value for '${SEARCH_HISTORY_KEY}': ${historyValue}`);
        } else {
            console.log(`Key '${SEARCH_HISTORY_KEY}' not found.`);
            vscode.window.showInformationMessage(`Key '${SEARCH_HISTORY_KEY}' not found.`);
        }

        // close the database connection in callback
        db.close((err: any) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });

    return historyValue;
}