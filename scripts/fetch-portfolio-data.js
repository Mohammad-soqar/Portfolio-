// Script to fetch portfolio data from Firebase and output as JSON
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, query, orderBy } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyBlmhzA5-FsaO3zjpgW8OQ2iYHzrt_AOzk",
    authDomain: "portfolio-623fa.firebaseapp.com",
    projectId: "portfolio-623fa",
    storageBucket: "portfolio-623fa.firebasestorage.app",
    messagingSenderId: "821501253155",
    appId: "1:821501253155:web:837ab4941a100f833f4396"
};

async function fetchData() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
        // Fetch experiences
        const expQuery = query(collection(db, "experiences"));
        const expSnapshot = await getDocs(expQuery);
        const experiences = expSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch projects
        const projQuery = query(collection(db, "projects"));
        const projSnapshot = await getDocs(projQuery);
        const projects = projSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch profile
        const profQuery = query(collection(db, "profile"));
        const profSnapshot = await getDocs(profQuery);
        const profile = profSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(JSON.stringify({ experiences, projects, profile }, null, 2));
    } catch (error) {
        console.error("Error fetching data:", error);
        process.exit(1);
    }

    process.exit(0);
}

fetchData();
