const pool = require("../db");
const { triggerTwilioWhatsappMsg } = require("../twilio");

const listEnquiries = async(
) => {
    const client = await pool.connect();
    try {
        let query = `
            SELECT 
                se.*,
                a.*,
                COALESCE(jsonb_agg(fu ORDER BY fu.follow_up_date DESC), '[]'::jsonb) as follow_up_details
            FROM sales_enquiries se
            left join follow_ups fu ON fu.sale_enquiry_id = se.sale_enquiry_id
            left join addresses a on a.address_id = se.address_id
            WHERE 1=1
            group by se.sale_enquiry_id, a.address_id
            ORDER BY se.expected_purchase_date DESC, se.sale_enquiry_id DESC
        `;
        const result = await client.query(query, []);

        return {
            enquiries: result
        };

    } finally {
        client.release();
    }
}

const enquiries = async() => {
    const pendingFollowUps = await listEnquiries();
    
    const todayPending = [];
    const olderPending = [];
    for (let i = 0; i < pendingFollowUps.enquiries.rows.length; i++) {
        let data = pendingFollowUps.enquiries.rows[i]
        console.log(data.follow_up_details.length);
        
        if ((data.follow_up_details.length == 0 || (data.follow_up_details.length > 0 && !data.follow_up_details[0])) && new Date(data.first_follow_up).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
            todayPending.push(data.customer_name);
        } else if (data.follow_up_details.length > 0 && new Date(data.follow_up_details[0]?.next_follow_up_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
            todayPending.push(data.customer_name);
        }

        if ((data.follow_up_details.length == 0 || (data.follow_up_details.length > 0 && !data.follow_up_details[0])) && new Date(data.first_follow_up).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            olderPending.push(data.customer_name);
        } else if (data.follow_up_details.length > 0 && new Date(data.follow_up_details[0]?.next_follow_up_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            olderPending.push(data.customer_name);
        }
    }

    let body = {todayPending: todayPending.length > 0 ? todayPending.join('\n') : 'None', olderPending: olderPending.length > 0 ? olderPending.join(', ') : 'None'}

    console.log(body);
    
    let numbers = ['7061972084', '9771067816'];
    for (let i = 0; i < numbers.length; i++) {
        const to = numbers[i];
        await triggerTwilioWhatsappMsg({body, to})
    }
    return { todayPending, olderPending };
}

module.exports = {
    enquiries
}
