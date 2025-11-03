// src/cancerData.jsx

import React from 'react';
// Import all the icons we need
import { 
  FaHeadSideCough, FaArrowDown, FaHeadSideVirus, FaLungsVirus, 
  FaExclamationTriangle, FaTint, FaRadiation, FaShieldAlt,
  FaDotCircle, FaMars, FaVenus, FaWeight, FaStopwatch, FaVenusMars, FaBone, FaSmoking, FaSun
} from 'react-icons/fa';
import { 
  GiBrain, GiLiver, GiStomach, GiLungs, 
  GiDrop, GiKidneys
} from 'react-icons/gi';
import { IoIosWater } from 'react-icons/io';

const iconStyle = { fontSize: 100, opacity: 1.0, color: 'var(--color-primary)' };

export const cancerData = {
  // --- LUNG CANCER ---
  'lung-cancer': {
    title: 'Lung Cancer',
    bannerIcon: <GiLungs style={iconStyle} />,
    imageUrl: '/path/to/lung-cancer-banner.jpg',
    overview: 'Lung cancer begins in the lungs and can spread to lymph nodes or other organs in the body. It is a leading cause of cancer deaths worldwide. Early detection and advancements in medical science have significantly improved prognosis and treatment options.',
    symptoms: [
      { icon: <FaHeadSideCough />, text: 'Persistent cough that gets worse over time' },
      { icon: <FaTint />, text: 'Coughing up blood or rust-colored sputum' },
      { icon: <FaArrowDown />, text: 'Unexplained weight loss and loss of appetite' },
      { icon: <FaLungsVirus />, text: 'Shortness of breath, wheezing, or hoarseness' },
      { icon: <FaHeadSideVirus />, text: 'Recurring infections like bronchitis or pneumonia' },
      { icon: <FaExclamationTriangle />, text: 'Chest pain that often worsens with deep breathing' },
    ],
    causes: [
      { name: 'Smoking:', text: 'The leading risk factor, responsible for about 80% of lung cancer deaths.' },
      { name: 'Secondhand Smoke:', text: 'Exposure to others\' smoke increases risk.' },
      { name: 'Radon Gas:', text: 'A naturally occurring radioactive gas that can accumulate in homes.' },
      { name: 'Asbestos & Other Carcinogens:', text: 'Exposure to industrial substances.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Removal of the cancerous part of the lung or the entire lung.' },
      { name: 'Chemotherapy:', text: 'Drugs used to kill cancer cells, often used before or after surgery.' },
      { name: 'Radiation Therapy:', text: 'High-energy rays to destroy cancer cells.' },
      { name: 'Targeted Therapy:', text: 'Drugs that target specific genes or proteins involved in cancer growth.' },
      { name: 'Immunotherapy:', text: 'Uses the body\'s immune system to fight cancer.' },
    ],
  },
  // --- BREAST CANCER ---
  'breast-cancer': {
    title: 'Breast Cancer',
    bannerIcon: <FaDotCircle style={iconStyle} />,
    imageUrl: '/path/to/breast-cancer-banner.jpg',
    overview: 'Breast cancer is a disease in which cells in the breast grow out of control. The kind of breast cancer depends on which cells in the breast turn into cancer. It is the most common cancer in women worldwide.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'New lump in the breast or underarm (armpit).' },
      { icon: <FaExclamationTriangle />, text: 'Thickening or swelling of part of the breast.' },
      { icon: <FaExclamationTriangle />, text: 'Irritation or dimpling of breast skin.' },
      { icon: <FaExclamationTriangle />, text: 'Redness or flaky skin in the nipple area or the breast.' },
    ],
    causes: [
      { name: 'Being Female:', text: 'The most significant risk factor, though men can get it too.' },
      { name: 'Age:', text: 'Risk increases with age.' },
      { name: 'Family History:', text: 'Genetic mutations (BRCA1, BRCA2) can be inherited.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Lumpectomy (removing the lump) or mastectomy (removing the breast).' },
      { name: 'Chemotherapy:', text: 'Drugs to shrink or kill cancer cells.' },
      { name: 'Hormone Therapy:', text: 'Blocks hormones that fuel cancer growth.' },
      { name: 'Radiation Therapy:', text: 'High-energy rays to kill remaining cancer cells.' },
    ],
  },
  // --- HEAD & NECK CANCER ---
  'head-neck-cancer': {
    title: 'Head & Neck Cancer',
    bannerIcon: <FaHeadSideVirus style={iconStyle} />,
    overview: 'This group of cancers starts in the mouth, nose, throat, larynx (voice box), sinuses, or salivary glands. Most are squamous cell carcinomas. Early detection is key to preserving quality of life.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'A sore in the mouth or throat that does not heal' },
      { icon: <FaHeadSideVirus />, text: 'Persistent pain in the throat' },
      { icon: <FaArrowDown />, text: 'Difficulty swallowing or breathing' },
      { icon: <FaHeadSideVirus />, text: 'A lump or swelling in the neck' },
    ],
    causes: [
      { name: 'Tobacco Use:', text: 'Includes cigarettes, cigars, pipes, and smokeless tobacco.' },
      { name: 'Alcohol Use:', text: 'Heavy and frequent alcohol consumption is a major risk factor.' },
      { name: 'HPV:', text: 'Infection with the Human Papillomavirus (HPV) is a significant cause of throat cancers.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'To remove the cancerous tumor and affected lymph nodes.' },
      { name: 'Radiation Therapy:', text: 'Often used alone for small tumors or combined with chemotherapy.' },
      { name: 'Chemotherapy:', text: 'Used to treat larger tumors or cancer that has spread.' },
    ],
  },
  // --- LIVER CANCER ---
  'liver-cancer': {
    title: 'Liver Cancer',
    bannerIcon: <GiLiver style={iconStyle} />,
    overview: 'Liver cancer is cancer that begins in the cells of your liver. The most common type is hepatocellular carcinoma. Chronic infection with certain hepatitis viruses is a leading cause.',
    symptoms: [
      { icon: <FaWeight />, text: 'Losing weight without trying' },
      { icon: <FaArrowDown />, text: 'Loss of appetite' },
      { icon: <FaExclamationTriangle />, text: 'Pain in the upper abdomen' },
      { icon: <FaExclamationTriangle />, text: 'Jaundice (yellowing of the skin and eyes)' },
    ],
    causes: [
      { name: 'Chronic Hepatitis B or C:', text: 'The most common cause of liver cancer worldwide.' },
      { name: 'Cirrhosis:', text: 'Scarring of the liver, often caused by alcohol abuse or hepatitis.' },
      { name: 'Aflatoxins:', text: 'Poisons produced by mold that can grow on crops stored poorly.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Partial hepatectomy to remove the tumor, or a full liver transplant.' },
      { name: 'Ablation Therapy:', text: 'Destroying cancer cells using heat, cold, or alcohol injection.' },
      { name: 'Targeted Therapy:', text: 'Drugs that block the growth and spread of cancer cells.' },
    ],
  },
  // --- PROSTATE CANCER ---
  'prostate-cancer': {
    title: 'Prostate Cancer',
    bannerIcon: <FaMars style={iconStyle} />,
    overview: 'Prostate cancer is one of the most common types of cancer in men. It usually grows slowly and is confined to the prostate gland, where it may not cause serious harm. However, some types are aggressive and can spread quickly.',
    symptoms: [
      { icon: <IoIosWater />, text: 'Trouble urinating or a weak urine stream' },
      { icon: <FaTint />, text: 'Blood in the urine or semen' },
      { icon: <FaBone />, text: 'Bone pain, especially in the hips, spine, or ribs' },
      { icon: <FaExclamationTriangle />, text: 'Erectile dysfunction' },
    ],
    causes: [
      { name: 'Age:', text: 'Risk increases significantly after age 50.' },
      { name: 'Family History:', text: 'Having a father or brother with prostate cancer increases risk.' },
      { name: 'Ethnicity:', text: 'Men of African descent have a higher risk.' },
    ],
    treatments: [
      { name: 'Active Surveillance:', text: 'Monitoring the cancer closely for slow-growing tumors.' },
      { name: 'Surgery:', text: 'Radical prostatectomy to remove the prostate gland.' },
      { name: 'Radiation Therapy:', text: 'Using high-energy beams to kill cancer cells.' },
      { name: 'Hormone Therapy:', text: 'Stops the body from producing testosterone, which fuels cancer growth.' },
    ],
  },
  // --- BRAIN CANCER ---
  'brain-cancer': {
    title: 'Brain Cancer',
    bannerIcon: <GiBrain style={iconStyle} />,
    overview: 'Brain cancer refers to tumors (abnormal growths of cells) in the brain. Primary brain tumors start in the brain, while metastatic tumors start elsewhere in the body and spread to the brain. Treatment depends heavily on the tumor\'s type, size, and location.',
    symptoms: [
      { icon: <FaHeadSideVirus />, text: 'New onset or change in pattern of headaches' },
      { icon: <FaExclamationTriangle />, text: 'Seizures' },
      { icon: <FaArrowDown />, text: 'Unexplained nausea or vomiting' },
      { icon: <FaExclamationTriangle />, text: 'Vision problems, slurred speech, or confusion' },
    ],
    causes: [
      { name: 'Unknown:', text: 'In most cases, the exact cause of primary brain tumors is not clear.' },
      { name: 'Radiation Exposure:', text: 'Exposure to ionizing radiation has been shown to increase risk.' },
      { name: 'Family History:', text: 'A small percentage of brain tumors are linked to inherited genetic syndromes.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'The primary treatment if the tumor is accessible.' },
      { name: 'Radiation Therapy:', text: 'Used after surgery or if surgery is not an option.' },
      { name: 'Chemotherapy:', text: 'Drugs that can kill tumor cells, often used for more aggressive tumors.' },
    ],
  },
  // --- OVARIAN CANCER ---
  'ovarian-cancer': {
    title: 'Ovarian Cancer',
    bannerIcon: <FaVenus style={iconStyle} />,
    overview: 'Ovarian cancer begins in the ovaries, the female reproductive glands that produce eggs. It often goes undetected until it has spread within the pelvis and abdomen, making it more difficult to treat.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'Abdominal bloating or swelling' },
      { icon: <FaArrowDown />, text: 'Quickly feeling full when eating' },
      { icon: <FaWeight />, text: 'Unexplained weight loss' },
      { icon: <IoIosWater />, text: 'Frequent need to urinate' },
    ],
    causes: [
      { name: 'Age:', text: 'Most common in older women.' },
      { name: 'Family History:', text: 'Inherited gene mutations (BRCA1, BRCA2) increase risk.' },
      { name: 'Hormone Therapy:', text: 'Long-term use of estrogen replacement therapy may increase risk.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Typically involves removing the ovaries, fallopian tubes, and uterus.' },
      { name: 'Chemotherapy:', text: 'Often used after surgery to kill any remaining cancer cells.' },
      { name: 'Targeted Therapy:', text: 'Drugs that target specific vulnerabilities in cancer cells.' },
    ],
  },
  // --- STOMACH CANCER ---
  'stomach-cancer': {
    title: 'Stomach Cancer',
    bannerIcon: <GiStomach style={iconStyle} />,
    overview: 'Also known as gastric cancer, this is a growth of cancerous cells in the lining of the stomach. It tends to develop slowly over many years and often has few early symptoms, making early detection difficult.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'Persistent indigestion and heartburn' },
      { icon: <FaArrowDown />, text: 'Loss of appetite and unexplained weight loss' },
      { icon: <FaExclamationTriangle />, text: 'Stomach pain and a feeling of fullness after eating small meals' },
      { icon: <FaTint />, text: 'Vomiting, with or without blood' },
    ],
    causes: [
      { name: 'H. pylori Infection:', text: 'A common bacteria that can infect the stomach lining.' },
      { name: 'Diet:', text: 'A diet high in smoked, pickled, and salty foods is a risk factor.' },
      { name: 'Smoking:', text: 'Tobacco use increases the risk of stomach cancer.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Subtotal (partial) or total gastrectomy (removal of the stomach).' },
      { name: 'Chemotherapy:', text: 'Can be used before surgery to shrink the tumor or after to kill remaining cells.' },
      { name: 'Radiation Therapy:', text: 'Often used in combination with chemotherapy.' },
    ],
  },
  // --- BLOOD CANCER ---
  'blood-cancer': {
    title: 'Blood Cancer',
    bannerIcon: <GiDrop style={iconStyle} />,
    overview: 'Blood cancers affect the production and function of your blood cells. Most of these cancers start in your bone marrow where blood is produced. The three main types are Leukemia, Lymphoma, and Myeloma.',
    symptoms: [
      { icon: <FaHeadSideVirus />, text: 'Fever, chills, and persistent fatigue or weakness' },
      { icon: <FaHeadSideVirus />, text: 'Frequent or severe infections' },
      { icon: <FaArrowDown />, text: 'Unexplained weight loss' },
      { icon: <FaBone />, text: 'Bone pain or tenderness' },
    ],
    causes: [
      { name: 'Unknown:', text: 'The exact cause is unknown but involves changes (mutations) in the DNA of blood cells.' },
      { name: 'Risk Factors:', text: 'Include family history, exposure to certain chemicals (like benzene), and some genetic disorders.' },
    ],
    treatments: [
      { name: 'Chemotherapy:', text: 'The primary treatment for most leukemias.' },
      { name: 'Stem Cell Transplant:', text: 'To replace diseased bone marrow with healthy marrow.' },
      { name: 'Radiation Therapy:', text: 'May be used to destroy cancer cells or relieve pain.' },
    ],
  },
  // --- GALLBLADDER CANCER ---
  'gallbladder-cancer': {
    title: 'Gallbladder Cancer',
    bannerIcon: <GiKidneys style={iconStyle} />,
    overview: 'Gallbladder cancer is an uncommon cancer that begins in the gallbladder, a small organ under the liver. It is often found at a late stage because it rarely causes early symptoms.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'Abdominal pain, particularly in the upper right section' },
      { icon: <FaExclamationTriangle />, text: 'Abdominal bloating' },
      { icon: <FaExclamationTriangle />, text: 'Jaundice (yellowing of the skin and eyes)' },
      { icon: <FaWeight />, text: 'Unexplained weight loss' },
    ],
    causes: [
      { name: 'Gallstones:', text: 'A history of gallstones is the most common risk factor.' },
      { name: 'Chronic Inflammation:', text: 'Long-term inflammation of the gallbladder can increase risk.' },
      { name: 'Age:', text: 'More common in older adults.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'The only potentially curative treatment, often involving removal of the gallbladder and parts of the liver.' },
      { name: 'Chemotherapy:', text: 'Used to control cancer that has spread.' },
      { name: 'Radiation Therapy:', text: 'May be used after surgery to kill any remaining cells.' },
    ],
  },
  // --- THROAT CANCER ---
  'throat-cancer': {
    title: 'Throat Cancer',
    bannerIcon: <FaHeadSideVirus style={iconStyle} />,
    overview: 'Throat cancer refers to cancerous tumors that develop in your throat (pharynx), voice box (larynx), or tonsils. It is part of the larger "Head & Neck Cancer" group.',
    symptoms: [
      { icon: <FaHeadSideVirus />, text: 'A persistent cough or sore throat' },
      { icon: <FaHeadSideVirus />, text: 'A change or hoarseness in the voice' },
      { icon: <FaArrowDown />, text: 'Difficulty swallowing' },
      { icon: <FaExclamationTriangle />, text: 'A lump in the neck' },
    ],
    causes: [
      { name: 'Tobacco and Alcohol:', text: 'The two largest risk factors, especially when used together.' },
      { name: 'HPV:', text: 'Infection with the Human Papillomavirus is a major cause of oropharyngeal (throat) cancers.' },
    ],
    treatments: [
      { name: 'Radiation Therapy:', text: 'Often the first-line treatment for smaller throat cancers.' },
      { name: 'Surgery:', text: 'To remove the tumor, which can range from minimally invasive to complex.' },
      { name: 'Chemotherapy:', text: 'Often combined with radiation for more advanced stages.' },
    ],
  },
  // --- CERVICAL CANCER ---
  'cervical-cancer': {
    title: 'Cervical Cancer',
    bannerIcon: <FaVenus style={iconStyle} />,
    overview: 'Cervical cancer is a type of cancer that occurs in the cells of the cervix — the lower part of the uterus that connects to the vagina. Various strains of the human papillomavirus (HPV), a sexually transmitted infection, play a role in causing most cervical cancer.',
    symptoms: [
      { icon: <FaTint />, text: 'Vaginal bleeding after intercourse, between periods, or after menopause' },
      { icon: <FaTint />, text: 'Watery, bloody vaginal discharge that may be heavy and have a foul odor' },
      { icon: <FaExclamationTriangle />, text: 'Pelvic pain or pain during intercourse' },
    ],
    causes: [
      { name: 'HPV:', text: 'The vast majority of cervical cancers are caused by persistent HPV infection.' },
      { name: 'Smoking:', text: 'Increases the risk of developing cervical cancer.' },
      { name: 'Weakened Immune System:', text: 'Makes the body less able to fight off HPV.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Can range from removing a cone-shaped piece of cervical tissue (conization) to a full hysterectomy.' },
      { name: 'Radiation Therapy:', text: 'Often combined with chemotherapy for more advanced stages.' },
      { name: 'Vaccination:', text: 'The HPV vaccine can prevent most cases of cervical cancer.' },
    ],
  },
  // --- COLON CANCER ---
  'colon-cancer': {
    title: 'Colon Cancer',
    bannerIcon: <GiKidneys style={iconStyle} />,
    overview: 'Colon cancer is a type of cancer that begins in the large intestine (colon). It typically affects older adults, though it can happen at any age. It usually begins as small, noncancerous (benign) clumps of cells called polyps that form on the inside of the colon.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'A persistent change in your bowel habits' },
      { icon: <FaTint />, text: 'Rectal bleeding or blood in your stool' },
      { icon: <FaArrowDown />, text: 'Persistent abdominal discomfort, such as cramps, gas, or pain' },
      { icon: <FaExclamationTriangle />, text: 'A feeling that your bowel doesn\'t empty completely' },
    ],
    causes: [
      { name: 'Polyps:', text: 'Most colon cancers develop from precancerous polyps.' },
      { name: 'Age:', text: 'The majority of people diagnosed are over 50.' },
      { name: 'Family History:', text: 'Inherited syndromes can increase risk, such as Lynch syndrome.' },
    ],
    treatments: [
      { name: 'Colonoscopy:', text: 'Used for screening, polyp removal (polypectomy), and early-stage cancer removal.' },
      { name: 'Surgery:', text: 'Partial colectomy to remove the part of the colon containing the cancer.' },
      { name: 'Chemotherapy:', text: 'Used to treat cancer that has spread or to reduce recurrence risk.' },
    ],
  },
  // --- THYROID CANCER ---
  'thyroid-cancer': {
    title: 'Thyroid Cancer',
    bannerIcon: <FaHeadSideVirus style={iconStyle} />,
    overview: 'Thyroid cancer occurs in the cells of the thyroid, a butterfly-shaped gland located at the base of your neck. Most thyroid cancers are slow-growing, but some types can be very aggressive. Prognosis is generally excellent with treatment.',
    symptoms: [
      { icon: <FaExclamationTriangle />, text: 'A lump (nodule) that can be felt through the skin on your neck' },
      { icon: <FaHeadSideVirus />, text: 'Changes to your voice, including increasing hoarseness' },
      { icon: <FaArrowDown />, text: 'Difficulty swallowing' },
      { icon: <FaExclamationTriangle />, text: 'Pain in your neck and throat' },
    ],
    causes: [
      { name: 'Radiation Exposure:', text: 'High levels of radiation, especially during childhood.' },
      { name: 'Family History:', text: 'Some genetic syndromes increase the risk.' },
      { name: 'Gender:', text: 'Women are diagnosed more often than men.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'Thyroidectomy (removal of all or part of the thyroid) is the most common treatment.' },
      { name: 'Radioactive Iodine:', text: 'Used after surgery to destroy any remaining thyroid tissue and cancer cells.' },
      { name: 'Hormone Therapy:', text: 'Thyroid hormone pills to replace natural hormones and suppress cancer cell growth.' },
    ],
  },
  // --- BLADDER CANCER ---
  'bladder-cancer': {
    title: 'Bladder Cancer',
    bannerIcon: <IoIosWater style={iconStyle} />,
    overview: 'Bladder cancer most often begins in the cells (urothelial cells) that line the inside of your bladder. It\'s most common in older adults, but can occur at any age. Most bladder cancers are diagnosed at an early stage, when they are highly treatable.',
    symptoms: [
      { icon: <FaTint />, text: 'Blood in urine (hematuria), which may make urine appear red or cola-colored' },
      { icon: <IoIosWater />, text: 'Frequent urination' },
      { icon: <FaExclamationTriangle />, text: 'Painful urination' },
      { icon: <FaExclamationTriangle />, text: 'Back pain' },
    ],
    causes: [
      { name: 'Smoking:', text: 'Cigarette smoking is the single biggest risk factor for bladder cancer.' },
      { name: 'Chemical Exposure:', text: 'Exposure to certain industrial chemicals, especially in dyes, rubber, and leather.' },
      { name: 'Age:', text: 'Risk increases with age; most are diagnosed over 55.' },
    ],
    treatments: [
      { name: 'Transurethral Resection (TURBT):', text: 'A procedure to remove early-stage tumors from the bladder lining.' },
      { name: 'Intravesical Therapy:', text: 'Putting liquid medicine (like chemotherapy or BCG) directly into the bladder.' },
      { name: 'Cystectomy:', text: 'Surgery to remove all or part of the bladder, for more invasive cancers.' },
    ],
  },
  // --- BONE CANCER ---
  'bone-cancer': {
    title: 'Bone Cancer',
    bannerIcon: <FaBone style={iconStyle} />,
    overview: 'Primary bone cancer (which starts in the bone) is very rare. Most cancer in the bones is metastatic, meaning it spread from somewhere else (like breast, lung, or prostate). The most common types of primary bone cancer are osteosarcoma and Ewing sarcoma.',
    symptoms: [
      { icon: <FaBone />, text: 'Persistent bone pain, often worse at night' },
      { icon: <FaExclamationTriangle />, text: 'Swelling and tenderness near the affected area' },
      { icon: <FaBone />, text: 'Weakened bone, leading to a fracture' },
      { icon: <FaHeadSideVirus />, text: 'Fatigue and unexplained weight loss' },
    ],
    causes: [
      { name: 'Unknown:', text: 'The cause of most bone cancers is unknown.' },
      { name: 'Genetic Syndromes:', text: 'Certain rare, inherited syndromes can increase risk.' },
      { name: 'Radiation Therapy:', text: 'Previous exposure to radiation for another cancer can be a risk factor.' },
    ],
    treatments: [
      { name: 'Surgery:', text: 'The most common treatment, aiming to remove the entire tumor.' },
      { name: 'Chemotherapy:', text: 'Often used before surgery to shrink the tumor and after to kill remaining cells.' },
      { name: 'Radiation Therapy:', text: 'Used to destroy cancer cells, often when surgery is not possible.' },
    ],
  },
};