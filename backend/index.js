import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { calculateRecommendation } from './logic.js'; 

const app = express();
app.use(cors());
app.use(express.json());

// --- MOCK DATABASES & MOCK USER ---
// --- MOCK DATABASES & MOCK USER ---
const MOCK_USER_ID = "user_1"; 
const products = [ 
  { 
    id: 1, 
    name: "Ketoconazole Shampoo", 
    category: "Treatment", 
    price: 499, 
    description: "Clinical anti-dandruff solution.",
    image: "/Ketoconazole-removebg-preview.png"
  },
  { 
    id: 2, 
    name: "Minoxidil 5% Solution", 
    category: "Treatment", 
    price: 699, 
    description: "FDA-approved to stimulate hair follicles.",
    image: "/Mioxidil-removebg-preview.png" 
  },
  { 
    id: 3, 
    name: "Soothing Scalp Serum", 
    category: "Care", 
    price: 349, 
    description: "Reduces oil, itching, and irritation.",
    image: "/Smooth-removebg-preview.png"
  },
  { 
    id: 4, 
    name: "Biotin Complex Gummies", 
    category: "Supplement", 
    price: 599, 
    description: "Daily vitamins for hair strength.",
    image: "/Bear_Gummies-removebg-preview.png"
  },
  { 
    id: 5, 
    name: "Derma Roller 0.5mm", 
    category: "Tool", 
    price: 299, 
    description: "Micro-needling tool for scalp health.",
    image: "/Derma_Roller-removebg-preview.png"
  },
  { 
    id: 6, 
    name: "Organic Rosemary Oil", 
    category: "Care", 
    price: 399, 
    description: "Natural oil for hair density.",
    image: "/RoseMary-removebg-preview.png"
  }
];
const clinics = [ 
  { id: 1, name: "VCare Hair & Skin Clinic", city: "Tirunelveli", price: 500, rating: 4.7, specialty: "Hair Transplantation" },
  { id: 2, name: "Advanced GroHair & GloSkin", city: "Tirunelveli", price: 800, rating: 4.9, specialty: "Hair Transplantation" },
  { id: 3, name: "D Cure Aesthetics", city: "Tirunelveli", price: 400, rating: 4.9, specialty: "Cosmetology" },
  { id: 4, name: "Fresh Hair Fixing", city: "Thoothukudi", price: 300, rating: 4.9, specialty: "Hair Replacement" },
  { id: 5, name: "DZeven Aesthetic Clinic", city: "Thoothukudi", price: 450, rating: 4.6, specialty: "Skin & Hair Care" },
  { id: 6, name: "DR TAMILS A PLUS", city: "Thoothukudi", price: 500, rating: 4.8, specialty: "Dermatology" },
  { id: 7, name: "Rajamouli Skin & Cosmetology", city: "Tenkasi", price: 350, rating: 4.9, specialty: "Cosmetology" },
  { id: 8, name: "Arya Clinic", city: "Tenkasi", price: 600, rating: 4.9, specialty: "Dermatology" },
  { id: 9, name: "Mount Sinai Clinic", city: "Tenkasi", price: 400, rating: 4.6, specialty: "Dermatology" }
];

let assessmentsDB = [];
let uploadsDB = []; // <-- Brought this back!
let ordersDB = [];
let autosaveDB = {}; 

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// --- API VALIDATION MIDDLEWARE ---
const validateAnswers = (req, res, next) => {
  if (!req.body.answers || typeof req.body.answers !== 'object') {
    return res.status(400).json({ error: "Invalid payload: 'answers' object is required." });
  }
  next();
};

// --- AUTOSAVE ENDPOINTS ---
app.post('/api/autosave', (req, res) => {
  autosaveDB[MOCK_USER_ID] = req.body.answers;
  res.json({ success: true, savedAt: new Date().toISOString() });
});

app.get('/api/autosave', (req, res) => {
  res.json({ answers: autosaveDB[MOCK_USER_ID] || null });
});

// --- CORE ENDPOINTS ---

// 👇 THIS IS THE MISSING UPLOAD ROUTE I FORGOT! 👇
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided." });
  
  const fileMetadata = { 
    id: uploadsDB.length + 1, 
    filename: req.file.originalname, 
    uploadTime: new Date().toISOString() 
  };
  uploadsDB.push(fileMetadata);
  
  console.log("\n=== 📸 NEW FILE UPLOADED ===");
  console.log("Metadata Saved to DB:", fileMetadata);
  console.log("=============================\n");

  setTimeout(() => {
    res.json({ hairDensity: "low", dryness: "moderate", recessionScore: 7, scalpHealth: "needs_attention" });
  }, 1500);
});
// 👆 END MISSING ROUTE 👆

app.post('/api/assessments', validateAnswers, (req, res) => {
  const { answers, imageAnalysis } = req.body;
  const result = calculateRecommendation(answers, imageAnalysis, products);
  
  const finalAssessment = {
    id: assessmentsDB.length + 1,
    userId: MOCK_USER_ID,
    date: new Date().toISOString(),
    answers,
    imageAnalysis,
    ...result,
    timeline: "3 to 6 months of consistent use"
  };

  assessmentsDB.push(finalAssessment);
  delete autosaveDB[MOCK_USER_ID]; // Clear autosave on completion
  res.json(finalAssessment);
});

app.get('/api/products', (req, res) => res.json(products));
app.get('/api/clinics', (req, res) => res.json(clinics));

app.post('/api/orders', (req, res) => {
  if (!req.body.cart || !Array.isArray(req.body.cart)) return res.status(400).json({ error: "Invalid cart format" });
  ordersDB.push({ id: ordersDB.length + 1, userId: MOCK_USER_ID, date: new Date().toISOString(), items: req.body.cart });
  res.json({ success: true });
});

// --- USER DASHBOARD ENDPOINTS (History & Comparison) ---
app.get('/api/user/dashboard', (req, res) => {
  const userAssessments = assessmentsDB.filter(a => a.userId === MOCK_USER_ID);
  const userOrders = ordersDB.filter(o => o.userId === MOCK_USER_ID);
  res.json({ history: userAssessments, orders: userOrders });
});

// --- ADMIN ENDPOINTS ---
app.get('/api/admin/data', (req, res) => {
  res.json({ totalUsers: 1, assessments: assessmentsDB, orders: ordersDB });
});

app.listen(5000, () => console.log(`Backend running on port 5000`));