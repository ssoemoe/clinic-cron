$(document).ready(function () {
    let current = 0;
    let params = {};
    const divs = [
        'first_name_div',
        'middle_name_div',
        'last_name_div',
        'street_address_div',
        'street_address_2_div',
        'city_div',
        'state_div',
        'cell_phone_number_div',
        'home_phone_number_div',
        'email_div',
        'dob_div',
        'gender_div',
        'ssn_div',
        'emergency_contact_number_div',
        'emergency_contact_relationship_div',
        'emergency_contact_name_div',
        'primary_insurance_company_name_div',
        'primary_insurance_id_div',
        'primary_insurance_plan_name_div',
        'primary_insurance_plan_type_div',
        'submit_div'
    ];
    const url = window.location.href;
    if (url.split('?').length < 2) {
        alert("Url is malformed!");
        return;
    }
    const keyValuePairs = url.split('?')[1].split('&');
    for (let kv of keyValuePairs) {
        let key = kv.split("=")[0].trim();
        let value = kv.split("=")[1].trim();
        params[key] = value;
    }
    if (!params["id"]) {
        alert("No Patient ID detected!");
        return;
    }
    const patientId = Number(params["id"]);
    let patientData = {};

    // init
    $('#new-patient-form').html($(`#${divs[0]}`).html());
    $('#prev').hide();

    const slide = (direction) => {
        if (direction === 'next' && current === divs.length - 1) return;
        if (direction === 'prev' && current === 0) return;
        current = direction === 'next' ? current + 1 : current - 1;
        currentDiv = `#${divs[current]}`;
        $('#new-patient-form').html($(currentDiv).html());

        // phone numbers
        const phone_numbers = {
            'cell_phone_number_div': 'cell_phone_number',
            'home_phone_number_div': 'home_phone_number',
            'emergency_contact_number_div': 'emergency_contact_number'
        };
        if (Object.keys(phone_numbers).includes(divs[current])) {
            $(`#${phone_numbers[divs[current]]}`).on('input', function () {
                if ($(this).val().trim().length === 10) {
                    const text = $(this).val();
                    $(this).val(`(${text.substring(0, 3)}) ${text.substring(3, 6)}-${text.substring(6, 10)}`);
                    return;
                }
            });
        }

        //submit button handler
        $("#submit_btn").on('click', async function () {
            const data = {
                "first_name": patientData["first_name"],
                "middle_name": patientData["middle_name"],
                "last_name": patientData["last_name"],
                "address": `${patientData["street_address"]}${patientData['street_address_2'] ? ', ' + patientData['street_address_2'] : ''}`,
                "city": patientData["city"],
                "state": patientData["state"],
                "cell_phone": patientData["cell_phone_number"],
                "email": patientData["email"],
                "date_of_birth": `${patientData['dob_year']}-${patientData["dob_month"]}-${patientData['dob_day']}`,
                "gender": patientData["male"] ? "Male" : "Female",
                "social_security_number": patientData["ssn"],
                "emergency_contact_phone": patientData["emergency_contact_number"],
                "emergency_contact_relation": patientData["emergency_contact_relationship"],
                "emergency_contact_name": patientData["emergency_contact_name"],
                "primary_insurance": {
                    "insurance_company": patientData["primary_insurance_company_name"],
                    "insurance_id_number": patientData["primary_insurance_id"],
                    "insurance_plan_name": patientData["primary_insurance_plan_name_id"],
                    "insurance_plan_type": patientData["primary_insurance_plan_type_id"]
                }
            };
            if (patientData["home_phone_number"]) data["home_phone"] = patientData["home_phone_number"];
            const response = await fetch(`/patients/${patientId}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            console.log(response);//DEBUG
            $("#new-patient-form").html($('#thank_you_div').html());
            $("#prev").hide();
        });

        //Determinin buttons if they need to show
        if (current !== 0) $('#prev').show();
        else $('#prev').hide();
        if (current === divs.length - 1) $('#next').hide();
        else $('#next').show();
    }

    const retrievePatientData = () => {
        const inputs = $('#new-patient-form').find('input');
        if (inputs.length > 0) {
            for (let input of inputs) {
                patientData[input.id] = input.type === "radio" ? input.checked : input.value;
            }
        }
    }

    const displayPatientData = () => {
        const inputs = $('#new-patient-form').find('input');
        if (inputs.length > 0) {
            for (let input of inputs) {
                if (patientData[input.id]) {
                    if (input.type === "radio") input.checked = patientData[input.id];
                    else input.value = patientData[input.id];
                }
            }
        }
    }

    $('body').on('keypress', function (e) {
        // when enter key is pressed
        if (e.which === 13) {
            retrievePatientData();
            slide('next');
            displayPatientData();
        }
    });
    $('#next').on('click', function () {
        retrievePatientData();
        slide('next');
        displayPatientData();
    });
    $('#prev').on('click', function () {
        retrievePatientData();
        slide('prev');
        displayPatientData();
    });
});