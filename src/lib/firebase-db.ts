import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface TotalMonth {
    id?: string;
    userId: string;
    month: string; // Format: "YYYY-MM"
    total: number;
    des: string; // Mô tả ngắn gọn về tháng đó
    createdAt?: Date;
    updatedAt?: Date;
}

// Định nghĩa các hạng mục chi tiêu cố định
export type ExpenseCategory =
    | "eat" // Ăn uống
    | "shopping" // Mua sắm
    | "transport" // Giao thông
    | "entertainment" // Giải trí
    | "health" // Sức khỏe
    | "education" // Giáo dục
    | "housing" // Nhà ở
    | "utilities" // Tiện ích (điện, nước, internet)
    | "insurance" // Bảo hiểm
    | "investment" // Đầu tư
    | "gift" // Quà tặng
    | "other"; // Khác

// Định nghĩa các loại thu nhập
export interface Note {
    id?: string;
    userId: string;
    date: string; // Format: "YYYY-MM-DD"
    category: ExpenseCategory; // Hạng mục chi tiêu
    des: string; // Mô tả chi tiết
    idTotalMonth: string; // Khóa ngoại tham chiếu đến totalMonth
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User {
    id?: string;
    email: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// TotalMonth Operations
export const addTotalMonth = async (totalMonth: Omit<TotalMonth, "id" | "createdAt" | "updatedAt">) => {
    try {
        const docRef = await addDoc(collection(db, "totalMonth"), {
            ...totalMonth,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return { id: docRef.id, error: null };
    } catch (error: unknown) {
        return { id: null, error: (error as { message: string }).message };
    }
};

export const getTotalMonths = async (userId: string) => {
    try {
        const q = query(collection(db, "totalMonth"), where("userId", "==", userId), orderBy("month", "desc"));
        const querySnapshot = await getDocs(q);
        const totalMonths = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return { totalMonths, error: null };
    } catch (error: unknown) {
        return { totalMonths: [], error: (error as { message: string }).message };
    }
};

export const getTotalMonthByMonth = async (userId: string, month: string) => {
    try {
        const q = query(collection(db, "totalMonth"), where("userId", "==", userId), where("month", "==", month));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { totalMonth: { id: doc.id, ...doc.data() }, error: null };
        }
        return { totalMonth: null, error: null };
    } catch (error: unknown) {
        return { totalMonth: null, error: (error as { message: string }).message };
    }
};

export const updateTotalMonth = async (id: string, updates: Partial<TotalMonth>) => {
    try {
        const docRef = doc(db, "totalMonth", id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now(),
        });
        return { error: null };
    } catch (error: unknown) {
        return { error: (error as { message: string }).message };
    }
};

export const deleteTotalMonth = async (id: string) => {
    try {
        await deleteDoc(doc(db, "totalMonth", id));
        return { error: null };
    } catch (error: unknown) {
        return { error: (error as { message: string }).message };
    }
};

// Notes Operations
export const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
        const docRef = await addDoc(collection(db, "notes"), {
            ...note,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return { id: docRef.id, error: null };
    } catch (error: unknown) {
        return { id: null, error: (error as { message: string }).message };
    }
};

export const getNotes = async (userId: string, idTotalMonth?: string) => {
    try {
        let q;
        if (idTotalMonth) {
            q = query(
                collection(db, "notes"),
                where("userId", "==", userId),
                where("idTotalMonth", "==", idTotalMonth),
                orderBy("date", "desc")
            );
        } else {
            q = query(collection(db, "notes"), where("userId", "==", userId), orderBy("date", "desc"));
        }

        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return { notes, error: null };
    } catch (error: unknown) {
        return { notes: [], error: (error as { message: string }).message };
    }
};

export const getNotesByMonth = async (userId: string, month: string) => {
    try {
        // Lấy totalMonth trước
        const { totalMonth } = await getTotalMonthByMonth(userId, month);
        if (!totalMonth) {
            return { notes: [], error: null };
        }

        // Lấy notes của tháng đó
        const { notes } = await getNotes(userId, totalMonth.id);
        return { notes, error: null };
    } catch (error: unknown) {
        return { notes: [], error: (error as { message: string }).message };
    }
};

export const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
        const docRef = doc(db, "notes", id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now(),
        });
        return { error: null };
    } catch (error: unknown) {
        return { error: (error as { message: string }).message };
    }
};

export const deleteNote = async (id: string) => {
    try {
        await deleteDoc(doc(db, "notes", id));
        return { error: null };
    } catch (error: unknown) {
        return { error: (error as { message: string }).message };
    }
};

// Users
export const createUser = async (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            ...user,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return { id: docRef.id, error: null };
    } catch (error: unknown) {
        return { id: null, error: (error as { message: string }).message };
    }
};

export const getUser = async (id: string) => {
    try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { user: { id: docSnap.id, ...docSnap.data() }, error: null };
        } else {
            return { user: null, error: "User not found" };
        }
    } catch (error: unknown) {
        return { user: null, error: (error as { message: string }).message };
    }
};

export const updateUser = async (id: string, updates: Partial<User>) => {
    try {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now(),
        });
        return { error: null };
    } catch (error: unknown) {
        return { error: (error as { message: string }).message };
    }
};

// Utility Functions
export const getCurrentMonth = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const getCurrentDate = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(
        2,
        "0"
    )}`;
};

export const formatMonth = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
        2,
        "0"
    )}`;
};

// Combined Operations
export const addNoteWithTotalMonth = async (
    userId: string,
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId" | "idTotalMonth">,
    totalMonthData?: Omit<TotalMonth, "id" | "createdAt" | "updatedAt" | "userId">
) => {
    try {
        const batch = writeBatch(db);

        // Tạo hoặc cập nhật totalMonth
        let totalMonthId: string;
        const month = noteData.date.substring(0, 7); // Lấy YYYY-MM từ date

        const { totalMonth } = await getTotalMonthByMonth(userId, month);

        if (totalMonth) {
            // Cập nhật totalMonth hiện có
            totalMonthId = totalMonth.id!;
            const newTotal = (totalMonth as TotalMonth).total + 1; // Luôn tăng 1 cho mỗi note
            batch.update(doc(db, "totalMonth", totalMonthId), {
                total: newTotal,
                updatedAt: Timestamp.now(),
            });
        } else {
            // Tạo totalMonth mới
            const totalMonthRef = doc(collection(db, "totalMonth"));
            totalMonthId = totalMonthRef.id;
            batch.set(totalMonthRef, {
                userId,
                month,
                total: 1, // Bắt đầu với 1
                des: totalMonthData?.des || `Tháng ${month}`,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        }

        // Thêm note
        const noteRef = doc(collection(db, "notes"));
        batch.set(noteRef, {
            ...noteData,
            userId,
            idTotalMonth: totalMonthId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        await batch.commit();
        return { noteId: noteRef.id, totalMonthId, error: null };
    } catch (error: unknown) {
        return { noteId: null, totalMonthId: null, error: (error as { message: string }).message };
    }
};

// Category Utilities
export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
    { value: "eat", label: "Ăn uống", icon: "🍽️" },
    { value: "shopping", label: "Mua sắm", icon: "🛍️" },
    { value: "transport", label: "Giao thông", icon: "🚗" },
    { value: "entertainment", label: "Giải trí", icon: "🎮" },
    { value: "health", label: "Sức khỏe", icon: "🏥" },
    { value: "education", label: "Giáo dục", icon: "📚" },
    { value: "housing", label: "Nhà ở", icon: "🏠" },
    { value: "utilities", label: "Tiện ích", icon: "⚡" },
    { value: "insurance", label: "Bảo hiểm", icon: "🛡️" },
    { value: "investment", label: "Đầu tư", icon: "📈" },
    { value: "gift", label: "Quà tặng", icon: "🎁" },
    { value: "other", label: "Khác", icon: "📝" },
];

export const getCategoryLabel = (category: ExpenseCategory): string => {
    const found = EXPENSE_CATEGORIES.find((cat) => cat.value === category);
    return found ? found.label : "Khác";
};

export const getCategoryIcon = (category: ExpenseCategory): string => {
    const found = EXPENSE_CATEGORIES.find((cat) => cat.value === category);
    return found ? found.icon : "📝";
};

export const getCategories = () => {
    return EXPENSE_CATEGORIES;
};

// Filter and Statistics Functions
export const getNotesByCategory = async (userId: string, category: ExpenseCategory) => {
    try {
        const q = query(
            collection(db, "notes"),
            where("userId", "==", userId),
            where("category", "==", category),
            orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return { notes, error: null };
    } catch (error: unknown) {
        return { notes: [], error: (error as { message: string }).message };
    }
};

export const getNotesByCategoryAndMonth = async (userId: string, category: ExpenseCategory, month: string) => {
    try {
        // Lấy totalMonth trước
        const { totalMonth } = await getTotalMonthByMonth(userId, month);
        if (!totalMonth) {
            return { notes: [], error: null };
        }

        // Lấy notes theo category và totalMonth
        const q = query(
            collection(db, "notes"),
            where("userId", "==", userId),
            where("category", "==", category),
            where("idTotalMonth", "==", totalMonth.id),
            orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return { notes, error: null };
    } catch (error: unknown) {
        return { notes: [], error: (error as { message: string }).message };
    }
};

export const getCategoryStatistics = async (userId: string, month?: string) => {
    try {
        let notes;
        if (month) {
            const { totalMonth } = await getTotalMonthByMonth(userId, month);
            if (!totalMonth) {
                return { statistics: {}, error: null };
            }
            const { notes: monthNotes } = await getNotes(userId, totalMonth.id);
            notes = monthNotes;
        } else {
            const { notes: allNotes } = await getNotes(userId);
            notes = allNotes;
        }

        const statistics = {} as Record<ExpenseCategory, number>;

        // Khởi tạo tất cả categories với giá trị 0
        EXPENSE_CATEGORIES.forEach((cat) => {
            statistics[cat.value] = 0;
        });

        // Đếm số lượng notes theo category
        notes.forEach((note) => {
            const noteData = note as unknown as { category: ExpenseCategory };
            statistics[noteData.category]++;
        });

        return { statistics, error: null };
    } catch (error: unknown) {
        return { statistics: {}, error: (error as { message: string }).message };
    }
};

