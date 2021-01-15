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
        'zip_code_div',
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
    const ins_plans = [
        "Automobile Medical", "Blue Cross/Blue Shield", "Champus", "Commercial Insurance Co.", "Disability",
        "Federal Employees Program", "Health Maintenance Organization", "Medicaid", "Veterans Affairs Plan"
    ].sort();
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
    for (let type of ins_plans) {
        var elem = $("<option></option>");
        elem.attr("value", type);
        let text = type;
        if (type > 20) {
            text = type.substring(0, 21);
        }
        elem.text(text);
        elem.appendTo($(`select#insurance_plan_type`));
    }
    $.getJSON("/insurances", function (insList) {
        let result = insList.sort((a, b) => a.payer_name < b.payer_name ? -1 : a.payer_name > b.payer_name ? 1 : 0);
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            var elem = $("<option></option>");
            elem.attr("value", result[i].payer_id);
            if (result[i].payer_name.length > 20) {
                result[i].payer_name = result[i].payer_name.substring(0, 21);
            }
            elem.text(result[i].payer_name);
            elem.appendTo($(`select#primary_insurance_company_name`));
        }
    });

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
                "zip_code": patientData["zip_code"],
                "primary_insurance": {
                    "insurance_company": patientData["primary_insurance_company_name"],
                    "insurance_id_number": patientData["primary_insurance_id"],
                    "insurance_plan_name": patientData["primary_insurance_plan_name_id"],
                    "insurance_plan_type": patientData["insurance_plan_type"],
                    "insurance_payer_id": patientData["insurance_payer_id"],
                    "insurance_claim_office_number": "",
                    "insurance_group_name": "",
                    "insurance_group_number": "",
                    "is_subscriber_the_patient": true,
                    "patient_relationship_to_subscriber": "",
                    "photo_back": "",
                    "photo_front": "",
                    "subscriber_address": "",
                    "subscriber_city": "",
                    "subscriber_country": "",
                    "subscriber_date_of_birth": "",
                    "subscriber_first_name": "",
                    "subscriber_gender": "",
                    "subscriber_last_name": "",
                    "subscriber_middle_name": "",
                    "subscriber_social_security": "",
                    "subscriber_state": "",
                    "subscriber_suffix": "",
                    "subscriber_zip_code": ""
                }
            };
            if (patientData["home_phone_number"]) data["home_phone"] = patientData["home_phone_number"];
            await fetch(`/patients/${patientId}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            await fetch(`/insurances`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Insurance information for ${patientData["first_name"]} ${patientData["last_name"]}`,
                    text: `<h1>Insurance information for ${patientData["first_name"]} ${patientData["last_name"]}</h1><br>
                    Phone: ${patientData['cell_phone_number']}<br>
                    Insurance Company: ${patientData["primary_insurance_company_name"]}<br>
                    Insurance ID No: ${patientData["primary_insurance_id"]}<br>
                    Insurance Plan Name: ${patientData["primary_insurance_plan_name_id"]}<br>
                    Insurance Plan Type: ${patientData["insurance_plan_type"]}<br>
                    Insurance Payer ID: ${patientData["insurance_payer_id"]}<br>`
                })
            });
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
        const selects = $('#new-patient-form').find('select');
        if (inputs.length > 0) {
            for (let input of inputs) {
                patientData[input.id] = input.type === "radio" ? input.checked : input.value;
            }
        }
        else if (selects.length > 0) {
            if (selects[0].id === "primary_insurance_company_name") {
                patientData["insurance_payer_id"] = $(`#${selects[0].id}`).find(":selected").val();
                patientData["primary_insurance_company_name"] = $(`#${selects[0].id}`).find(":selected").text();
            }
            else {
                patientData["insurance_plan_type"] = $(`#${selects[0].id}`).find(":selected").val();
            }
        }
    }

    const displayPatientData = () => {
        const inputs = $('#new-patient-form').find('input');
        const selects = $('#new-patient-form').find('select');
        if (inputs.length > 0) {
            for (let input of inputs) {
                if (patientData[input.id]) {
                    if (input.type === "radio") input.checked = patientData[input.id];
                    else input.value = patientData[input.id];
                }
            }
        }
        else if (selects.length > 0) {
            if (selects[0].id === "primary_insurance_company_name") {
                $(`#${selects[0].id}`).find(":selected").val(patientData["insurance_payer_id"]);
                $(`#${selects[0].id}`).find(":selected").text(patientData["primary_insurance_company_name"]);
            }
            else {

                $(`#${selects[0].id}`).find(":selected").val(patientData["insurance_plan_type"]);
                $(`#${selects[0].id}`).find(":selected").text(patientData["insurance_plan_type"]);
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