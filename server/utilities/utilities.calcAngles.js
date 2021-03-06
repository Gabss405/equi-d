function find_angle(A, B, C) {
  const Ab = Math.abs(B.lat - C.lat);
  const Ac = Math.abs(B.lng - C.lng);

  const aSide = Math.sqrt(Ab * Ab + Ac * Ac);

  const Bb = Math.abs(A.lat - C.lat);
  const Bc = Math.abs(A.lng - C.lng);

  const bSide = Math.sqrt(Bb * Bb + Bc * Bc);

  const Cb = Math.abs(A.lat - B.lat);
  const Cc = Math.abs(A.lng - B.lng);

  const cSide = Math.sqrt(Cb * Cb + Cc * Cc);

  //const angleA
  const angleA = Math.acos((bSide * bSide + cSide * cSide - aSide * aSide) / (2 * bSide * cSide));
  const angleB = Math.acos((aSide * aSide + cSide * cSide - bSide * bSide) / (2 * aSide * cSide));
  const angleC = Math.acos((aSide * aSide + bSide * bSide - cSide * cSide) / (2 * aSide * bSide));

  console.log((angleA * 180) / Math.PI, (angleB * 180) / Math.PI, (angleC * 180) / Math.PI);
  //calculating length of sides of triangle

  // var AB = Math.sqrt(Math.pow(B.lat - A.lat, 2) + Math.pow(B.lng - A.lng, 2));
  // var BC = Math.sqrt(Math.pow(B.lat - C.lat, 2) + Math.pow(B.lng - C.lng, 2));
  // var AC = Math.sqrt(Math.pow(C.lat - A.lat, 2) + Math.pow(C.lng - A.lng, 2));

  // console.log(AB, BC, AC);

  // angleB = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));

  // return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

module.exports = find_angle;
