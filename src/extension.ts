// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SearchHistoryProvider } from './searchHistoryView';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const searchHistoryProvider = new SearchHistoryProvider(context);
	vscode.window.registerTreeDataProvider('searchHist', searchHistoryProvider);

	vscode.commands.registerCommand('searchHist.refreshSearchHistory', () => searchHistoryProvider.refresh());
	vscode.commands.registerCommand('searchHist.copyNode', arg => searchHistoryProvider.copy(arg));
}

// This method is called when your extension is deactivated
export function deactivate() { }
