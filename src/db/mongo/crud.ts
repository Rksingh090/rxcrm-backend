import { Document, InsertOneResult, ObjectId, WithId } from "mongodb";
import { connectToMongo } from "../../config/db";
import { RxModule } from "../../types/rx-module";


export async function DbInsertDocument(collectionName: string, document: RxModule): Promise<InsertOneResult<Document>> {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({
        ...document,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return result;
}

export async function DbFindAll(collectionName: string, pipeline?: Document[]): Promise<Document[]> {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);

    const aggregateCurr = collection.aggregate(pipeline);
    const data = await aggregateCurr.toArray();

    return data;
}

export async function DbFindOne(collectionName: string, filter: any): Promise<WithId<Document> | any> {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);
    const data = await collection.findOne(filter);
    return data as any;
}
export async function DbFindById(collectionName: string, id: string): Promise<WithId<Document> | any> {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);
    const data = await collection.findOne({
        _id: new ObjectId(id)
    });
    return data as any;
}
