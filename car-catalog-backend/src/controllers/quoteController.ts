import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import { EmailService } from '../services/emailService';
import Car from '../models/Car';
import Quote from '../models/Quote';

// Crear una nueva cotización
export const createQuote = async (req: Request, res: Response) => {
    try {
        const { carId, customerName, email, phone, downPayment, term } = req.body;

        // 1. Obtener detalles del auto (usando campo 'id' personalizado, no _id)
        const car = await Car.findOne({ id: carId });

        if (!car) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // 2. Guardar el Lead en la Base de Datos
        const newQuote = new Quote({
            car: car._id,
            customerName,
            email,
            phone,
            downPayment,
            term,
            status: 'pending'
        });
        await newQuote.save();

        // Variable para el PDF (si se genera exitosamente)
        let pdfData: Buffer | null = null;

        // Bloque aislado para la generación de PDF para que no fallé toda la solicitud si esto falla
        try {
            // 3. Descargar imagen del auto si existe
            let imageBuffer: Buffer | null = null;
            try {
                if (car.image && (car.image.startsWith('http') || car.image.startsWith('https'))) {
                    const response = await axios.get(car.image, { responseType: 'arraybuffer', timeout: 5000 });
                    imageBuffer = Buffer.from(response.data);
                }
            } catch (error) {
                console.warn('Could not download car image for PDF:', error);
            }

            // 4. Generar el PDF en memoria
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));

            // --- DISEÑO DEL PDF ---

            // Logo / Título
            doc.fillColor('#333333')
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('COTIZACIÓN DE VEHÍCULO', { align: 'center' });

            doc.fontSize(10)
                .font('Helvetica')
                .text(`Folio: ${newQuote._id.toString().slice(-6).toUpperCase()}`, { align: 'right' });
            doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'center' });

            doc.moveDown();
            doc.lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#EA580C').stroke();
            doc.moveDown();

            // Imagen del Auto
            if (imageBuffer) {
                try {
                    const imgWidth = 400;
                    const x = (doc.page.width - imgWidth) / 2;
                    doc.image(imageBuffer, x, doc.y, { width: imgWidth });
                    doc.moveDown(14);
                } catch (imgErr) {
                    console.warn('Error embedding image in PDF:', imgErr);
                    doc.text('(Imagen no disponible en el PDF)', { align: 'center' });
                    doc.moveDown(2);
                }
            }

            const startY = doc.y;

            doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold')
                .text(`${car.year} ${car.make} ${car.carModel}`, { align: 'left' });

            doc.fillColor('#EA580C').fontSize(16)
                .text(`$${car.price.toLocaleString()}`, { align: 'left' });

            doc.moveDown();

            const col1X = 50;
            const col2X = 300;
            const currentY = doc.y;

            doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Especificaciones', col1X, currentY);
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(10);
            doc.text(`Transmisión: ${car.transmission === 'a' ? 'Automática' : 'Manual'}`);
            doc.text(`Combustible: ${car.fuel_type}`);
            doc.text(`Clase: ${car.class}`);
            doc.text(`Cilindros: ${car.cylinders}`);
            doc.text(`Rendimiento Combinado: ${car.combination_mpg} MPG`);
            if (car.description) {
                doc.moveDown(0.5);
                // Safe handling of description
                const safeDesc = car.description || '';
                doc.font('Helvetica-Oblique').text(safeDesc.substring(0, 100) + '...', { width: 220 });
            }

            doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Datos del Cliente', col2X, currentY);
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(10);
            doc.text(`Nombre: ${customerName || 'N/A'}`, col2X);
            doc.text(`Email: ${email || 'N/A'}`, col2X);
            doc.text(`Teléfono: ${phone || 'N/A'}`, col2X);

            doc.moveDown(2);

            doc.y = Math.max(doc.y, currentY + 120);

            if (car.features && Array.isArray(car.features) && car.features.length > 0) {
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Características Destacadas');
                doc.moveDown(0.5);
                doc.font('Helvetica').fontSize(10);
                const featuresText = car.features.join(', ');
                doc.text(featuresText, { align: 'justify' });
                doc.moveDown();
            }

            doc.moveDown();
            doc.rect(50, doc.y, 500, 110).fill('#F3F4F6').stroke();

            const tableStartY = doc.y - 100;
            doc.fillColor('#000000');

            doc.fontSize(14).font('Helvetica-Bold').text('Propuesta de Financiamiento', 70, tableStartY + 15);

            const price = car.price || 0;
            const downPaymentAmount = (price * (downPayment || 20)) / 100;
            const financedAmount = price - downPaymentAmount;
            const interestRate = 0.15;
            const monthlyInterest = interestRate / 12;
            const months = term || 48;
            const monthlyPayment = (financedAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));

            doc.fontSize(10).font('Helvetica');
            doc.text(`Precio del Vehículo:`, 70, tableStartY + 40);
            doc.text(`$${price.toLocaleString()}`, 200, tableStartY + 40, { align: 'right', width: 100 });

            doc.text(`Enganche (${downPayment}%):`, 70, tableStartY + 55);
            doc.text(`-$${downPaymentAmount.toLocaleString()}`, 200, tableStartY + 55, { align: 'right', width: 100 });

            doc.lineWidth(1).moveTo(70, tableStartY + 70).lineTo(300, tableStartY + 70).stroke();

            doc.font('Helvetica-Bold').text(`Monto a Financiar:`, 70, tableStartY + 75);
            doc.text(`$${financedAmount.toLocaleString()}`, 200, tableStartY + 75, { align: 'right', width: 100 });

            doc.fontSize(12).text('Mensualidad Estimada', 350, tableStartY + 40);
            doc.fontSize(24).fillColor('#EA580C').text(`$${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 350, tableStartY + 60);
            doc.fontSize(10).fillColor('#666666').text(`a ${months} meses`, 350, tableStartY + 85);

            doc.y = 700;
            doc.fontSize(8).fillColor('#999999').text('Esta cotización es de carácter informativo y no representa una oferta vinculante.', 50, 700, { align: 'center', width: 500 });
            doc.text('VeloDrive - El placer de conducir.', { align: 'center' });

            doc.end();

            await new Promise<void>((resolve, reject) => {
                doc.on('end', () => resolve());
                doc.on('error', reject);
            });

            pdfData = Buffer.concat(buffers);

        } catch (pdfError) {
            console.error('CRITICAL: Error generating PDF:', pdfError);
            // No detenemos el flujo, pero el email irá sin PDF
        }

        // 5. Enviar correo (no bloqueante - si falla, la cotización ya está guardada)
        let emailSent = false;
        try {
            const emailOptions: any = {
                to: email,
                subject: `Cotización Oficial: ${car.make} ${car.carModel} (${car.year})`,
                html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
  .header { background-color: #18181b; padding: 30px 40px; text-align: center; background-image: linear-gradient(to right, #18181b, #27272a); }
  .brand { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-decoration: none; }
  .brand span { color: #f97316; }
  .content { padding: 40px; color: #3f3f46; line-height: 1.6; }
  .greeting { font-size: 20px; font-weight: 600; color: #18181b; margin-bottom: 20px; }
  .car-summary { background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; margin: 25px 0; display: flex; align-items: center; }
  .car-details h3 { margin: 0 0 5px 0; color: #18181b; font-size: 18px; }
  .car-price { color: #ea580c; font-weight: 700; font-size: 20px; margin: 5px 0; }
  .car-specs { font-size: 14px; color: #71717a; }
  .attachment-box { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px 20px; margin: 25px 0; color: #9a3412; font-size: 14px; }
  .footer { background-color: #f4f4f5; padding: 30px; text-align: center; font-size: 12px; color: #a1a1aa; border-top: 1px solid #e4e4e7; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">VELO<span>DRIVE</span></div>
    </div>
    <div class="content">
      <div class="greeting">Hola ${customerName},</div>
      <p>Gracias por tu interés. Hemos recibido tu solicitud. Folio: <strong>${newQuote._id.toString().slice(-6).toUpperCase()}</strong>.</p>
      <div class="car-summary">
        <div class="car-details">
          <h3>${car.year} ${car.make} ${car.carModel}</h3>
          <div class="car-price">$${car.price.toLocaleString()}</div>
        </div>
      </div>
      ${pdfData ? `
      <div class="attachment-box">
        <strong>📎 Cotización PDF Adjunta:</strong><br>
        Revisa los detalles completos en el archivo adjunto.
      </div>` : `
      <div class="attachment-box" style="border-left-color: #ef4444; background-color: #fef2f2; color: #b91c1c;">
        <strong>Nota:</strong><br>
        Tu cotización ha sido registrada, pero hubo un problema técnico generando el PDF. Un asesor te enviará los detalles manualmente pronto.
      </div>
      `}
      <p>Un asesor experto te contactará al <strong>${phone}</strong>.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} VeloDrive Inc.</p>
    </div>
  </div>
</body>
</html>
                `
            };

            if (pdfData) {
                emailOptions.attachments = [
                    {
                        filename: `Cotizacion_${car.make}_${car.carModel}.pdf`,
                        content: pdfData,
                        contentType: 'application/pdf'
                    }
                ];
            }

            await EmailService.sendEmail(emailOptions);
            emailSent = true;
        } catch (emailError) {
            console.error('Error sending quote email (quote was still saved):', emailError);
        }

        // Notificación al admin (también no bloqueante)
        try {
            await EmailService.sendAdminNotification(
                'Nuevo Lead Generado 🚀',
                `Nuevo lead capturado:<br>
                 Cliente: <strong>${customerName}</strong><br>
                 Email: ${email}<br>
                 Teléfono: ${phone}<br>
                 Auto: ${car.fullName}<br>
                 ID Cotización: ${newQuote._id}<br>
                 PDF Generado: ${pdfData ? 'SI' : 'NO (Error)'}`
            );
        } catch (adminEmailError) {
            console.error('Error sending admin notification:', adminEmailError);
        }

        res.status(200).json({
            message: emailSent
                ? 'Cotización enviada con éxito'
                : 'Cotización registrada. Te contactaremos pronto.',
            quoteId: newQuote._id,
            emailSent
        });

    } catch (error: any) {
        console.error('Error creating quote:', error);
        // Devolvemos el error real para depuración
        res.status(500).json({
            message: 'Error generando la cotización',
            errorDetails: error.message || 'Unknown error',
            fullError: process.env.NODE_ENV === 'development' ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : undefined
        });
    }
};

// Obtener todas las cotizaciones (Admin)
export const getQuotes = async (req: Request, res: Response) => {
    try {
        const quotes = await Quote.find()
            .populate('car', 'make carModel year image price')
            .sort({ createdAt: -1 });
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quotes' });
    }
};

// Actualizar estado de una cotización
export const updateQuoteStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const quote = await Quote.findByIdAndUpdate(
            id,
            { status, notes },
            { new: true }
        );

        if (!quote) return res.status(404).json({ message: 'Cotización no encontrada' });

        res.json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quote' });
    }
};
