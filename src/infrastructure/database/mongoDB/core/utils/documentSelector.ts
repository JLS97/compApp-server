import {Document, Model} from 'mongoose';

export function documentSelector<T>(modelDefinition: Record<string, Model<T>>, attributeKey: string) {
  return (obj: T): Document => {
    const SelectedModel = modelDefinition[obj[attributeKey]];

    if(!SelectedModel){
      throw new Error(`Unsupported document type. Received: ${obj[attributeKey]}`);
    }

    return new SelectedModel(obj);
  }
}

