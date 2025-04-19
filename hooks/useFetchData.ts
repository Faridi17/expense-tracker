import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

const useFetchData = <T>(tableName: string, uid: string, extraConditions: string = "", params: any[] = []) => {
    const db = useSQLiteContext(); 
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tableName || !uid) return;

        const fetchData = async () => {
            try {
                const query = `SELECT * FROM ${tableName} WHERE uid = ? ${extraConditions} ORDER BY createdAt DESC`;
                const results = await db.getAllAsync(query, [uid, ...params]);
                setData(results as T[]);
            } catch (err) {
                console.log("Error fetching data:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tableName, uid, extraConditions, params]);

    return { data, loading, error };
};

export default useFetchData;
