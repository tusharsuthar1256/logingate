
import { Resend } from 'resend';

const resend = new Resend('re_8xRKudjB_4FzThLQvAsQbnrSnpzSRUhDp');

async function test() {
    console.log("Testing Resend...");
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'tusharsuthar081@gmail.com',
            subject: 'Test Email from Antigravity',
            html: '<p>If you see this, Resend is working!</p>'
        });

        if (error) {
            console.error("Resend Error:", error);
        } else {
            console.log("Resend Success:", data);
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

test();
