import { db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    orderBy,
    DocumentData,
    WithFieldValue
} from "firebase/firestore";

// Generic CRUD helpers with types
export const getById = async <T>(col: string, id: string): Promise<T | null> => {
    const docRef = doc(db, col, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as T;
    }
    return null;
};

export const getAll = async <T>(col: string, orderField?: string): Promise<T[]> => {
    let q = query(collection(db, col));
    if (orderField) {
        q = query(q, orderBy(orderField, "desc"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

export const create = async <T extends WithFieldValue<DocumentData>>(col: string, data: T) => {
    return await addDoc(collection(db, col), {
        ...data,
        createdAt: new Date().toISOString()
    });
};

export const update = async (col: string, id: string, data: Partial<DocumentData>) => {
    const docRef = doc(db, col, id);
    return await updateDoc(docRef, data);
};

export const remove = async (col: string, id: string) => {
    const docRef = doc(db, col, id);
    return await deleteDoc(docRef);
};
