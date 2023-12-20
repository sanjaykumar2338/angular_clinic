export class PatientRecord {
  expediente_id: string = "";
  fullname: string = "";
  patient_id: string = "";
  gender: string = "1";
  dob: string = "";
  education: string = "";
  maritalStatus: string = "";
  occupation: string = "";
  placeOrigin: string = "";
  address: string = "";
  doctor_id: string = "";
  location: string = "";
  allergies: {
    hasAllergy: boolean;
    specificAllergy: string;
  } = { hasAllergy: true, specificAllergy: "" };
  age: string = "";
  caregiver: string = "";
  vitalSignAssement: {
    bloodPressure: Array<{ visit: number; value: string }>;
    heartRate: Array<{ visit: number; value: string }>;
    age: Array<{ visit: number; value: string }>;
    time: Array<{ visit: number; value: string }>;
    respiratoryRate: Array<{ visit: number; value: string }>;
    temperature: Array<{ visit: number; value: string }>;
    actualWeight: Array<{ visit: number; value: string }>;
    idealWeight: Array<{ visit: number; value: string }>;
    height: Array<{ visit: number; value: string }>;
    bmi: Array<{ visit: number; value: string }>;
    headCircumference: Array<{ visit: number; value: string }>;
    abdominalCircumference: Array<{ visit: number; value: string }>;
    hipCircumference: Array<{ visit: number; value: string }>;
    date: Array<{ visit: number; value: string }>;
  } = {
    bloodPressure: [],
    heartRate: [],
    age: [],
    time: [],
    respiratoryRate: [],
    temperature: [],
    actualWeight: [],
    idealWeight: [],
    height: [],
    bmi: [],
    headCircumference: [],
    abdominalCircumference: [],
    hipCircumference: [],
    date: [],
  };
  medicalHistory: {
    respiratoryInfections: {
      hasRespiratoryInfections: boolean;
      type: string;
    };
    acuteDiarrhealDiseases: {
      hasAcuteDiarrhealDiseases: boolean;
      when: string;
    };
    contraceptiveMethod: {
      usesContraceptiveMethod: boolean;
      specifyMethod: string;
    };
  } = {
    respiratoryInfections: { hasRespiratoryInfections: false, type: "" },
    acuteDiarrhealDiseases: { hasAcuteDiarrhealDiseases: false, when: "" },
    contraceptiveMethod: { usesContraceptiveMethod: false, specifyMethod: "" },
  };
  nutritionControl: Array<{ visit: number; value: string }> = [];
  chronicDiseases: {
    diabetes: Array<{ visit: number; value: string }>;
    hypertension: Array<{ visit: number; value: string }>;
    obesity: Array<{ visit: number; value: string }>;
    dyslipidemias: Array<{ visit: number; value: string }>;
    others: Array<{ visit: number; value: string }>;
  } = {
    diabetes: [],
    hypertension: [],
    obesity: [],
    dyslipidemias: [],
    others: [],
  };
  visitsConsultations: Array<{ visit: number; value: string }> = [];
  diagnosisNursing: Array<{ visit: number; value: string }> = [];
  expectedResults: Array<{ visit: number; value: string }> = [];
  interventionsRecommendations: Array<{ visit: number; value: string }> = [];
  therapeuticPlan: Array<{
    date: string;
    biologicalMedicine: string;
    presentation: string;
    dose: string;
    via: string;
    time: string;
    applied: boolean;
  }> = [];
  appliedCodes: Array<{
    code: string;
    nurse: string;
    date: string;
    time: string;
  }> = [];
  observations: Array<{
    observation: string;
    nurse: string;
    date: string;
    time: string;
  }> = [];
  signatures: Array<{
    nurse: string;
    date: string;
    time: string;
    signature: string;
    licenseNumber: string;
    academic: string;
  }> = [];
  visitCount: number = 1;

  constructor(initialValues?: Partial<PatientRecord>) {
    this.fullname = initialValues?.fullname || "";
    this.patient_id = initialValues?.patient_id || "";
    this.expediente_id = initialValues?.expediente_id || "";
    this.age = initialValues?.age || "";
    this.gender = initialValues?.gender || "1";
    this.dob = initialValues?.dob || "";
    this.education = initialValues?.education || "";
    this.maritalStatus = initialValues?.maritalStatus || "";
    this.occupation = initialValues?.occupation || "";
    this.placeOrigin = initialValues?.placeOrigin || "";
    this.address = initialValues?.address || "";
    this.location = initialValues?.location || "";
    this.doctor_id = initialValues?.doctor_id || "";
    this.caregiver = initialValues?.caregiver || "";
    this.allergies = initialValues?.allergies || {
      hasAllergy: true,
      specificAllergy: "",
    };
    this.vitalSignAssement = initialValues?.vitalSignAssement || {
      bloodPressure: [],
      heartRate: [],
      age: [],
      time: [],
      respiratoryRate: [],
      temperature: [],
      actualWeight: [],
      idealWeight: [],
      height: [],
      bmi: [],
      headCircumference: [],
      abdominalCircumference: [],
      hipCircumference: [],
      date: [],
    };
    this.medicalHistory = initialValues?.medicalHistory || {
      respiratoryInfections: { hasRespiratoryInfections: false, type: "" },
      acuteDiarrhealDiseases: { hasAcuteDiarrhealDiseases: false, when: "" },
      contraceptiveMethod: {
        usesContraceptiveMethod: false,
        specifyMethod: "",
      },
    };
    this.nutritionControl = initialValues?.nutritionControl || [];
    this.chronicDiseases = initialValues?.chronicDiseases || {
      diabetes: [],
      hypertension: [],
      obesity: [],
      dyslipidemias: [],
      others: [],
    };
    this.visitsConsultations = initialValues?.visitsConsultations || [];
    this.diagnosisNursing = initialValues?.diagnosisNursing || [];
    this.expectedResults = initialValues?.expectedResults || [];
    this.interventionsRecommendations =
      initialValues?.interventionsRecommendations || [];
    this.therapeuticPlan = initialValues?.therapeuticPlan || [];
    this.appliedCodes = initialValues?.appliedCodes || [];
    this.observations = initialValues?.observations || [];
    this.signatures = initialValues?.signatures || [];
    this.visitCount = initialValues?.visitCount || 0;
  }
}
