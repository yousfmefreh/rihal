import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAumhBxI2c5ZQmiByTpz9g_zQ8HvgtuNc8",
  authDomain: "rihal-a8876.firebaseapp.com",
  projectId: "rihal-a8876",
  storageBucket: "rihal-a8876.firebasestorage.app",
  messagingSenderId: "837997619585",
  appId: "1:837997619585:web:c0399bebb8a6f4ceaf2080",
  measurementId: "G-LVQ7GGFF9S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// كائن العمليات الموحد الذي تستدعيه الصفحات (Client & Office)
window.rihalFirebaseReady = Promise.resolve({
  // حفظ طلب رحلة جديد من صفحة العميل
  async createRequest({ requestId, request }) {
    try {
      await addDoc(collection(db, "travelRequests"), {
        request_id: requestId,
        ...request,
        office_status: "new",
        createdAt: new Date().toISOString()
      });
      return { requestId, emailSent: true };
    } catch (error) {
      console.error("Error creating request in Firestore:", error);
      throw error;
    }
  },

  // جلب قائمة الطلبات للوحة المكتب
  async listRequests() {
    try {
      const q = query(collection(db, "travelRequests"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const requests = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        requests.push({
          ...data,
          firestoreId: docSnap.id,
          request_id: data.request_id ?? data.requestId,
          created_at: data.created_at ?? data.createdAt
        });
      });
      return { requests };
    } catch (error) {
      console.error("Error listing requests from Firestore:", error);
      throw error;
    }
  },

  // تحديث حالة الطلب إلى "تمت المراجعة"
  async markReviewed(firestoreId) {
    try {
      await updateDoc(doc(db, "travelRequests", firestoreId), { office_status: "reviewed" });
      return { success: true };
    } catch (error) {
      console.error("Error marking request as reviewed:", error);
      throw error;
    }
  },

  // حذف الطلب
  async deleteRequest(firestoreId) {
    try {
      await deleteDoc(doc(db, "travelRequests", firestoreId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  // نظام مصادقة موظفي المكتب
  async signIn(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    return await signOut(auth);
  },

  async sendVerificationEmail(user) {
    return await sendEmailVerification(user);
  },

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
});
