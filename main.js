// Returns a random DNA base
const returnRandBase = () => {
  const dnaBases = ["A", "T", "C", "G"];
  return dnaBases[Math.floor(Math.random() * 4)];
};

// Returns a random single stand of DNA containing 15 bases
const mockUpStrand = () => {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
};

const pAequorFactory = (specimenNum, dna) => {
  return {
    _specimenNum: specimenNum,
    _dna: dna,
    get specimenNum() {
      return this._specimenNum;
    },
    get dna() {
      return this._dna;
    },
    mutate() {
      const randomIndex = () => Math.floor(Math.random() * this._dna.length);
      const mutatedDNA = () => {
        const mutatedSeq = this._dna.slice();
        mutatedSeq[randomIndex()] = returnRandBase();

        return mutatedSeq;
      };
      let newSeq = mutatedDNA();

      while (newSeq.join("") === this._dna.join("")) {
        newSeq = mutatedDNA();
      }

      this._dna = newSeq;

      return this._dna;
    },
    compareDNA(specimen) {
      let count = 0;

      for (let i = 0; i < specimen.dna.length; i++) {
        if (this._dna[i] === specimen.dna[i]) count += 1;
      }

      const percentage = Math.round((count / specimen._dna.length) * 100);
      console.log(
        `specimen #${this._specimenNum} and specimen #${specimen.specimenNum} have ${percentage}% DNA in common`
      );
    },
    willLikelySurvive() {
      let count = 0;
      this._dna.forEach((base) => {
        if (base === "C" || base === "G") count += 1;
      });

      return count / this._dna.length >= 0.6;
    },
    complementStrand() {
      return this._dna.map((base) => {
        switch (base) {
          case "A":
            return "T";
          case "C":
            return "G";
          case "G":
            return "C";
          case "T":
            return "A";
        }
      });
    },
  };
};

// Create 30 instances of pAequor that can survive in their natural environment
// Used to output to the console before creating integration in a web page
// const TOTAL = 30;
// const pAequorWillSurvive = [];
// let specimenNum = 1;

// while (pAequorWillSurvive.length < TOTAL) {
//   const specimen = pAequorFactory(specimenNum, mockUpStrand());

//   if (specimen.willLikelySurvive()) pAequorWillSurvive.push(specimen);
//   specimenNum += 1;
// }

// console.log(
//   "Likely to survive specimen list length:",
//   pAequorWillSurvive.length
// );
// console.log("\nLikely to survive specimen list:");
// pAequorWillSurvive.forEach((specimen, i) => {
//   if (i === 0) console.log(`Specimen #${specimen.specimenNum} DNA Sequence:`);
//   else console.log(`\nSpecimen #${specimen.specimenNum} DNA Sequence:`);
//   console.log(specimen.dna);

//   // Complimentary strand
//   console.log(
//     `Specimen #${specimen.specimenNum} Complimentary Strand Sequence:`
//   );
//   console.log(specimen.complementStrand());
// });

function generate30Specimens() {
  const TOTAL = 30;
  const pAequorWillSurvive = [];
  let specimenNum = 1;

  while (pAequorWillSurvive.length < TOTAL) {
    const specimen = pAequorFactory(specimenNum, mockUpStrand());

    if (specimen.willLikelySurvive()) pAequorWillSurvive.push(specimen);
    specimenNum += 1;
  }

  // Set local storage for generate specimens
  window.localStorage.setItem("specimens", JSON.stringify(pAequorWillSurvive));

  return pAequorWillSurvive;
}

function complementStrand(dna) {
  return dna.map((base) => {
    switch (base) {
      case "A":
        return "T";
      case "C":
        return "G";
      case "G":
        return "C";
      case "T":
        return "A";
    }
  });
}

function appendDataToHTML(specimenArr) {
  let innerHTMLStr = "";

  specimenArr.forEach((specimen) => {
    innerHTMLStr += `
      <tr>
        <td>${specimen.specimenNum}</td>
        <td>${specimen.dna.join(" ")}</td>
        <td>${complementStrand(specimen.dna).join(" ")}</td>
      </tr>
    `;
  });

  return innerHTMLStr;
}

function logDataToConsole(specimenData) {
  console.clear();
  specimenData.forEach((specimen) => {
    console.log(`Specimen #${specimen.specimenNum}:`);
    console.log(`DNA Strand 1: ${specimen.dna.join(" ")}`);
    console.log(`DNA Strand 2: ${complementStrand(specimen.dna).join(" ")}`);
    console.log("-".repeat(43));
  });
}

const generateSequenceBtn = document.querySelector(".button");

generateSequenceBtn.addEventListener("click", () => {
  const specimenDataElem = document.querySelector("#specimen-data");
  const specimens = generate30Specimens();

  specimenDataElem.innerHTML = appendDataToHTML(specimens);
  // Smooth scroll to the top of the specimens table
  const element = document.querySelector("#specimens");
  const y = element.getBoundingClientRect().top - 80;

  window.scrollTo({ top: y, behavior: "smooth" });
  logDataToConsole(specimens);
});

// If specimen data exist in local storage
if (window.localStorage.getItem("specimens")) {
  const specimenDataElem = document.querySelector("#specimen-data");
  const specimensObj = window.localStorage.getItem("specimens");
  const specimensData = JSON.parse(specimensObj);

  logDataToConsole(specimensData);
  specimenDataElem.innerHTML = appendDataToHTML(specimensData);
} else {
  const specimenDataElem = document.querySelector("#specimen-data");
  const specimens = generate30Specimens();

  specimenDataElem.innerHTML = appendDataToHTML(specimens);
  logDataToConsole(specimens);
}

// Smooth scroll navigation to the top when h1 heading in header is clicked
document.querySelectorAll(".top-link").forEach((linkElem) => {
  linkElem.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Add year to the DOM
const yearElem = document.querySelector(".year");
const year = new Date().getFullYear();
yearElem.innerText = year;
