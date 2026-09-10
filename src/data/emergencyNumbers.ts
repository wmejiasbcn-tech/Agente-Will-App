export interface EmergencyInfo {
  numbers: string[];
  note: string;
}

const E: Record<string, EmergencyInfo> = {
  ES: { numbers: ['112', '061'], note: 'Emergencias y urgencias sanitarias.' },
  AD: { numbers: ['112'], note: 'Emergencias.' },
  PT: { numbers: ['112'], note: 'Emergencias.' },
  FR: { numbers: ['112', '15'], note: 'Emergencias y SAMU.' },
  DE: { numbers: ['112'], note: 'Emergencias.' },
  IT: { numbers: ['112', '118'], note: 'Emergencias y sanitarias.' },
  GB: { numbers: ['999', '112'], note: 'Emergencias.' },
  IE: { numbers: ['112', '999'], note: 'Emergencias.' },
  NL: { numbers: ['112'], note: 'Emergencias.' },
  BE: { numbers: ['112'], note: 'Emergencias.' },
  CH: { numbers: ['144', '112'], note: 'Sanitarias y emergencias.' },
  AT: { numbers: ['112', '144'], note: 'Emergencias y sanitarias.' },
  SE: { numbers: ['112'], note: 'Emergencias.' },
  NO: { numbers: ['113', '112'], note: 'Ambulancia y emergencias.' },
  FI: { numbers: ['112'], note: 'Emergencias.' },
  DK: { numbers: ['112'], note: 'Emergencias.' },
  IS: { numbers: ['112'], note: 'Emergencias.' },
  PL: { numbers: ['112'], note: 'Emergencias.' },
  CZ: { numbers: ['112'], note: 'Emergencias.' },
  GR: { numbers: ['112', '166'], note: 'Emergencias y ambulancia.' },
  TR: { numbers: ['112'], note: 'Emergencias.' },
  UA: { numbers: ['103', '112'], note: 'Ambulancia y emergencias.' },
  RU: { numbers: ['103', '112'], note: 'Ambulancia y emergencias.' },
  US: { numbers: ['911'], note: 'Emergencias.' },
  CA: { numbers: ['911'], note: 'Emergencias.' },
  MX: { numbers: ['911'], note: 'Emergencias.' },
  GT: { numbers: ['123', '128'], note: 'Emergencias y bomberos/sanitario.' },
  CR: { numbers: ['911'], note: 'Emergencias.' },
  PA: { numbers: ['911'], note: 'Emergencias.' },
  CO: { numbers: ['123'], note: 'Emergencias.' },
  VE: { numbers: ['171'], note: 'Emergencias.' },
  EC: { numbers: ['911'], note: 'Emergencias.' },
  PE: { numbers: ['105', '117'], note: 'Policía y SAMU.' },
  BO: { numbers: ['911'], note: 'Emergencias.' },
  BR: { numbers: ['192', '190'], note: 'SAMU y policía.' },
  PY: { numbers: ['911'], note: 'Emergencias.' },
  UY: { numbers: ['911'], note: 'Emergencias.' },
  AR: { numbers: ['911', '107'], note: 'Emergencias y SAME.' },
  CL: { numbers: ['131', '133'], note: 'Ambulancia y carabineros.' },
  JP: { numbers: ['119', '110'], note: 'Bomberos/ambulancia y policía.' },
  KR: { numbers: ['119', '112'], note: 'Ambulancia y policía.' },
  CN: { numbers: ['120', '110'], note: 'Ambulancia y policía.' },
  TW: { numbers: ['119', '110'], note: 'Ambulancia y policía.' },
  HK: { numbers: ['999'], note: 'Emergencias.' },
  SG: { numbers: ['995', '999'], note: 'Ambulancia y policía.' },
  MY: { numbers: ['999'], note: 'Emergencias.' },
  TH: { numbers: ['1669', '191'], note: 'Ambulancia y policía.' },
  VN: { numbers: ['115'], note: 'Ambulancia.' },
  PH: { numbers: ['911'], note: 'Emergencias.' },
  ID: { numbers: ['112', '118'], note: 'Emergencias y ambulancia.' },
  IN: { numbers: ['112', '108'], note: 'Emergencias y ambulancia.' },
  NP: { numbers: ['102'], note: 'Ambulancia.' },
  PK: { numbers: ['15', '1122'], note: 'Policía y rescate.' },
  AU: { numbers: ['000', '112'], note: 'Emergencias.' },
  NZ: { numbers: ['111'], note: 'Emergencias.' },
  ZA: { numbers: ['10177', '112'], note: 'Ambulancia y emergencias.' },
  NG: { numbers: ['112'], note: 'Emergencias.' },
  KE: { numbers: ['112', '999'], note: 'Emergencias.' },
  EG: { numbers: ['123'], note: 'Ambulancia.' },
  MA: { numbers: ['15', '190'], note: 'Ambulancia y policía.' },
  IL: { numbers: ['101'], note: 'Ambulancia (Magen David Adom).' },
  AE: { numbers: ['998', '999'], note: 'Ambulancia y policía.' },
  SA: { numbers: ['997', '911'], note: 'Ambulancia y emergencias.' },
};

export function emergencyForCountry(code: string | undefined): EmergencyInfo {
  if (!code) {
    return {
      numbers: [],
      note: 'No hay un número único verificado para este lugar. Pregunta en recepción o busca el servicio de emergencias local.',
    };
  }
  const info = E[code.toUpperCase()];
  if (info) return info;
  return {
    numbers: ['112'],
    note: 'No hay un número verificado para este país. 112 funciona en muchos territorios; confirma el de allí.',
  };
}
