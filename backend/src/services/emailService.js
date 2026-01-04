import nodemailer from "nodemailer";

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
    }

    async sendVerificationCode(email, code, userName) {
        const mailOptions = {
            from: `"Gimnasio App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verifica tu cuenta - Gimnasio App",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                            border-radius: 10px;
                            padding: 40px;
                            color: #ffffff;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: #ff6b6b;
                            margin: 0;
                            font-size: 28px;
                        }
                        .code-box {
                            background: rgba(255, 255, 255, 0.1);
                            border: 2px solid #ff6b6b;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .code {
                            font-size: 36px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #ff6b6b;
                            font-family: 'Courier New', monospace;
                        }
                        .message {
                            font-size: 16px;
                            line-height: 1.8;
                            color: #e0e0e0;
                        }
                        .warning {
                            background: rgba(255, 107, 107, 0.1);
                            border-left: 4px solid #ff6b6b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 14px;
                            color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Verificación de Cuenta</h1>
                        </div>
                        
                        <p class="message">Hola <strong>${userName}</strong>,</p>
                        
                        <p class="message">
                            Gracias por registrarte en <strong>Gimnasio App</strong>. 
                            Para completar tu registro y activar tu cuenta, ingresa el siguiente código de verificación:
                        </p>
                        
                        <div class="code-box">
                            <div class="code">${code}</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⏱️ Este código expira en 5 minutos.</strong><br>
                            Si no solicitaste este código, ignora este correo.
                        </div>
                        
                        <p class="message">
                            Una vez verificado tu correo, podrás acceder a todas las funcionalidades de la aplicación.
                        </p>
                        
                        <div class="footer">
                            <p>Este es un correo automático, por favor no responder.</p>
                            <p>&copy; 2026 Gimnasio App. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error("Error sending verification email:", error);
            throw new Error("No se pudo enviar el correo de verificación");
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error("Email service connection failed:", error);
            return false;
        }
    }
}

export const emailService = new EmailService();
