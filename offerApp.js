// get params
const urlParams = new URLSearchParams(window.location.search);
document.addEventListener("DOMContentLoaded", function () {
  const title = document.title; // get from <title>
  document.querySelector('input[name="funnelName"]').value = title; // set in hidden input funnelName
});

// type of emails
const CHOOSE_EMAIL = 1;
const SHOW_EMAIL = document.querySelector('input[name="show_email"]').value || "false"; // get show_email param, if exists show_email = false
const isShow = SHOW_EMAIL === "true" ? "block" : "none"; // if show_email = true , show input email

// init tel input
function initializeIntlTelInput(inputElement) {
  const g = $('input[name="g"]').val();
  const country = $('input[name="country"]').val();
  let iti = window.intlTelInput(inputElement, {
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.3.2/build/js/utils.js",
    initialCountry: g || country,
    separateDialCode: true,
    preferredCountries: ['us', 'gb', 'br', 'ru', 'cn', 'es', 'it'],
    excludeCountries: ['ua'],
    strictMode: true,
  });

  inputElement.addEventListener("countrychange", function () {
    updateInputValues(inputElement, iti);
  });

  inputElement.addEventListener('input', function () {
    validatePhoneNumber(inputElement, iti);
  });

  updateInputValues(inputElement, iti);


  document.querySelectorAll("form").forEach((form) =>
    form.addEventListener("submit", (event) => {
      const isEmail = form.querySelector('input[name="email"]').value;
      if (!isEmail || (isEmail && isEmail.length < 3)) {
        const newMail = emailGenerator(form);
        form.querySelector('input[name="fakeEmail"]').value = newMail;
      }

      let fnameInput = form.querySelector('input[name="first_name"]');
      let lnameInput = form.querySelector('input[name="last_name"]');
      let emailInput = form.querySelector('input[name="email"]');
      let phoneInput = form.querySelector('input[name="phone"]');
      // flag which check all inputs when submite
      let allInputsValid = true;

      allInputsValid = checkInputRequired(fnameInput, 'first name', event) && allInputsValid;
      allInputsValid = checkInputRequired(lnameInput, 'last name', event) && allInputsValid;
      allInputsValid = checkInputRequired(phoneInput, 'phone', event) && allInputsValid;

      if (phoneInput.value.trim() !== '' && !iti.isValidNumber()) {
        showError(`Your phone is not correct.`, 5000);
        allInputsValid = false;
        event.preventDefault();
      }
      if (SHOW_EMAIL == 'true') {
        allInputsValid = checkInputRequired(emailInput, 'email', event) && allInputsValid;
      }
      // if all input valid , create loader
      if (allInputsValid) {
        createLoader();
      }
    }),
  );

}

function checkInputRequired(input, typeInput, eventForm) {
  if (input.value.trim() === '') {
    showError(`Please enter the ` + typeInput + ` and try again.`, 5000);
    invalidInput(input)
    eventForm.preventDefault();
    return false;
  }
  return true;
}
// for every ipnut name=phone
const inputs = document.querySelectorAll("input[name=phone]");
inputs.forEach(input => {
  initializeIntlTelInput(input);
});

// check valide phone number
function validatePhoneNumber(inputElement, iti) {
  if (iti.isValidNumber()) {
    inputElement.classList.add("valid");
    inputElement.classList.remove("invalid");
  } else {
    inputElement.classList.add("invalid");
    inputElement.classList.remove("valid");
  }
}
// submit forms listener. check email input

// update iti inputs
function updateInputValues(inputElement, iti) {
  $('input[name="phonecc"]').val(iti.getSelectedCountryData()['dialCode']);
  $('input[name="countryName"]').val(iti.getSelectedCountryData()['name']);
  $('input[name="countryCode"]').val(iti.getSelectedCountryData()['iso2']);
  inputElement.setAttribute('data-intlTelInput', iti.getSelectedCountryData()['dialCode']);
}


// emails 1
const EMAILS_1 = [
  { domain: "gmail.com", weight: 30 },
  { domain: "yahoo.com", weight: 8 },
  { domain: "outlook.com", weight: 18 },
  { domain: "icloud.com", weight: 12 },
  { domain: "hotmail.com", weight: 8 },
  { domain: "aol.com", weight: 1 },
  { domain: "protonmail.com", weight: 1 },
  { domain: "zoho.com", weight: 1 },
  { domain: "mail.com", weight: 8 },
  { domain: "gmx.com", weight: 1 },
  { domain: "hushmail.com", weight: 1 },
  { domain: "fastmail.com", weight: 4 },
  { domain: "tutanota.com", weight: 1 },
  { domain: "posteo.net", weight: 1 },
  { domain: "mailfence.com", weight: 1 },
];
// emails 2
const EMAILS_2 = [
  { domain: "gmail.com", weight: 22 },
  { domain: "yahoo.com", weight: 8 },
  { domain: "outlook.com", weight: 10 },
  { domain: "icloud.com", weight: 8 },
  { domain: "hotmail.com", weight: 4 },
  { domain: "rambler.ru", weight: 8 },
  { domain: "mail.ru", weight: 16 },
  { domain: "yandex.ru", weight: 4 },
  { domain: "yandex.com", weight: 16 },
  { domain: "fastmail.com", weight: 2 },
  { domain: "yandex.com", weight: 2 },
];
// all emails
const emailArrays = {
  1: EMAILS_1,
  2: EMAILS_2,
};
const EMAILS = emailArrays[CHOOSE_EMAIL]; // chose email
const EMAIL_LENGTH = EMAILS.length;
let rv_name =
  /^[(a-zA-Zа-яА-Я\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-`\s+)]*$/;

let rv_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

$('input[name="email"]').css("display", isShow);

$('input[name="phone"]').on("input", function () {
  $(this).val(function (_, value) {
    return value.charAt(0) === "0"
      ? value.substring(1).replace(/\D/g, "")
      : value.replace(/\D/g, "");
  });
});
$('input[name="first_name"]').on("input", function () {
  $(this).val(
    $(this)
      .val()
      .replace(/[^a-zA-Zа-яА-Я\u0600-\u06FF]/g, ""),
  );
});
$('input[name="last_name"]').on("input", function () {
  $(this).val(
    $(this)
      .val()
      .replace(/[^a-zA-Zа-яА-Я\u0600-\u06FF]/g, ""),
  );
});

$('input[name="phone"]').on("keyup", function () {
  const phoneInput = $(this);
  const phoneValue = phoneInput.val();
  const countryCode = $('input[name="phonecc"]').val();

  if (countryCode !== "7" && phoneValue.startsWith(countryCode)) {
    phoneInput.val(phoneValue.substring(countryCode.length));
  }
});


function initForm() {
  let inputs = document.querySelectorAll("input[name=phone]");
  let form = document.querySelectorAll("form");
  form.forEach((item) => {
    item.addEventListener("input", (event) => {
      checkValidation(event.target, item);
    });
  });
}

function checkValidation(target, item) {
  switch (target.getAttribute("name")) {
    case "first_name":
    case "last_name":
      target.value = target.value.split(" ").join("");
      target.value !== "" && rv_name.test(target.value)
        ? validInput(target)
        : invalidInput(target);
      break;

    case "email":
      target.setAttribute("data-valid", rv_email.test(target.value));
      rv_email.test(target.value) ? validInput(target) : invalidInput(target);
      break;
  }
}

function validInput(element) {
  element.classList.add("valid");
  element.classList.remove("invalid");
}

function invalidInput(element) {
  element.classList.add("invalid");
  element.classList.remove("valid");
}

initForm();

const emailDomain = () => {
  const totalWeight = EMAILS.reduce((sum, email) => sum + email.weight, 0);
  let random = Math.random() * totalWeight;

  for (const email of EMAILS) {
    if (random < email.weight) {
      return email.domain;
    }
    random -= email.weight;
  }
};

const emailGenerator = (form) => {
  const fNameInput = form.querySelector('input[name="first_name"]').value;
  const lNameInput = form.querySelector('input[name="last_name"]').value;
  const fName = convertToEnglish(fNameInput.toLowerCase());
  const lName = convertToEnglish(lNameInput.toLowerCase());

  const d = emailDomain();
  const currentDay = new Date().getDate();
  const num =
    Math.floor(
      Math.random() * (Math.pow(10, 4) - Math.pow(10, 2 - 1)) +
      Math.pow(10, 2 - 1),
    ) + currentDay;

  // const '.' = ['.', '.', '.', '.', '.', '.', '.'][Math.floor(Math.random() * 7)];
  const randomNum1 = Math.floor(Math.random() * 100);
  const randomNum2 = Math.floor(Math.random() * 100);

  const generateRandomDigits = (n) =>
    Math.floor(Math.random() * Math.pow(10, n))
      .toString()
      .padStart(n, "0");

  const scenarios = [
    () => `${lName}${fName}${num}@${d}`,
    () => `${fName.charAt(0)}${lName.charAt(0)}${generateRandomDigits(4)}@${d}`,
    () => `${randomNum1}${randomNum2}${lName}${"."}${fName}@${d}`,
    () => `${fName}.${lName}.${num}@${d}`,
    () => `${lName}${"."}${fName}${generateRandomDigits(3)}@${d}`,
    () => `${fName}${"."}${lName}${generateRandomDigits(2)}${currentDay}@${d}`,
    () => `${lName}${randomNum1}${"."}${generateRandomDigits(2)}${fName}@${d}`,
    () => `${generateRandomDigits(2)}${fName}${"."}${lName}${randomNum2}@${d}`,
    () =>
      `${lName}${generateRandomDigits(2)}${"."}${fName}${generateRandomDigits(3)}@${d}`,
    () => `${fName}${"."}${lName}${generateRandomDigits(4)}@${d}`,
    () => `${randomNum1}${fName}${"."}${lName}@${d}`,
    () => `${lName}${fName}${randomNum1}@${d}`,
    () => `${fName}${lName}${generateRandomDigits(2)}${"."}${randomNum2}@${d}`,
    () => `${randomNum1}${"."}${lName}${"."}${fName}@${d}`,
    () => `${lName}${randomNum2}${fName}@${d}`,
    () => `_${fName}${"."}${lName}${randomNum1}@${d}`,
    () => `${generateRandomDigits(3)}${lName}${"."}${fName}@${d}`,
    () => `${fName}${"."}${generateRandomDigits(3)}${lName}@${d}`,
    () =>
      `${fName}${"."}${lName}${randomNum2}${"."}${generateRandomDigits(2)}@${d}`,
    () =>
      `${lName}${generateRandomDigits(2)}${fName}${"."}${generateRandomDigits(2)}@${d}`,
    () => `${"."}${generateRandomDigits(3)}${fName}${"."}${lName}@${d}`,
    () => `${lName}${randomNum1}${fName}${"."}${generateRandomDigits(2)}@${d}`,
    () => `${generateRandomDigits(2)}${fName}${lName}${"."}${randomNum1}@${d}`,
  ];

  const randomScenario =
    scenarios[Math.floor(Math.random() * scenarios.length)];
  return randomScenario();
};

function convertToEnglish(input) {
  const transliterationTable = {
    // Кирилиця
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    ا: "a",
    أ: "a",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "j",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "dh",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "",
    غ: "gh",
    ف: "f",
    ق: "q",
    ك: "k",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    و: "w",
    ي: "y",
    ء: "",
    ـ: "",
    ئ: "i",
    ؤ: "u",
    ى: "a",
  };

  const text = input.replace(/[ьъ]/g, "");
  return text
    .split("")
    .map((char) => transliterationTable[char] || char)
    .join("");
}


function showError(text, time) {
  messageAlert(text, time);
}

function messageAlert(text, time) {
  // add google fonts
  if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
  }

  if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'crossorigin';
    document.head.appendChild(preconnect2);
  }

  if (!document.querySelector('link[href="https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap"]')) {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  // create new message about error
  let errorMessage = document.createElement("div");
  errorMessage.className = "errorMessage";
  errorMessage.classList.add(`error-${Date.now()}`); // create class with id

  const svg = ` <svg xmlns="http://www.w3.org/2000/svg" class="alert-svg" width="22" height="22" fill="#F59E0B" viewBox="0 0 24 24" stroke="white" > <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  const closeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" stroke="white" viewBox="0 0 512 512" class="s-ion-icon"><path d="M289.94,256l95-95A24,24,0,0,0,351,127l-95,95-95-95A24,24,0,0,0,127,161l95,95-95,95A24,24,0,1,0,161,385l95-95,95,95A24,24,0,0,0,385,351Z"></path></svg>`;

  const message =
    `<div id="messageSvg">${svg}</div>` +
    `<div class="messageText">` + text + `</div>` +
    `<div id="messageClose" onclick="hideError(this)">${closeSvg}</div>`;
  errorMessage.innerHTML = message;
  document.body.appendChild(errorMessage);

  // auto close error mesage
  setTimeout(() => {
    if (errorMessage) {
      errorMessage.remove();
    }
  }, time);
}

function hideError(element) {
  // manual close error mesage
  const errorMessage = element.closest(".errorMessage");
  if (errorMessage) {
    errorMessage.remove();
  }
}
function createLoader() {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  const loader = document.createElement('div')
  loader.id = 'loader';
  preloader.appendChild(loader);
  document.body.appendChild(preloader);
}
