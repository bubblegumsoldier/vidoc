export interface Config {
    savingStrategy: SavingStrategyLocal;
}

export class SavingStrategyLocal {
    type: 'local' = 'local';
    location: 'relative'|'central' = 'central';
    folder: string = '.vidoc';
}