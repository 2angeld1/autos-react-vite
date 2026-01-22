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

        // ✅ RESPUESTA INMEDIATA (Fire & Forget Strategy)
        // Respondemos al cliente inmediatamente para evitar timeouts
        res.status(200).json({
            message: 'Cotización registrada correctamente. Recibirás un correo en breve.',
            quoteId: newQuote._id
        });

        // 🚀 PROCESO DE FONDO (PDF + Email)
        // Ejecutamos esto sin await para no bloquear la respuesta
        (async () => {
            try {
                // Variable para el PDF (si se genera exitosamente)
                let pdfData: Buffer | null = null;

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

                // --- DISEÑO DEL PDF (simplificado para brevedad, usando la misma lógica) ---
                doc.fillColor('#333333').fontSize(24).font('Helvetica-Bold').text('COTIZACIÓN DE VEHÍCULO', { align: 'center' });
                doc.fontSize(10).font('Helvetica').text(`Folio: ${newQuote._id.toString().slice(-6).toUpperCase()}`, { align: 'right' });
                doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'center' });
                doc.moveDown();
                doc.lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#EA580C').stroke();
                doc.moveDown();

                if (imageBuffer) {
                    try {
                        const imgWidth = 400;
                        const x = (doc.page.width - imgWidth) / 2;
                        doc.image(imageBuffer, x, doc.y, { width: imgWidth });
                        doc.moveDown(14);
                    } catch (imgErr) { }
                }

                const startY = doc.y;
                doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold').text(`${car.year} ${car.make} ${car.carModel}`, { align: 'left' });
                doc.fillColor('#EA580C').fontSize(16).text(`$${car.price.toLocaleString()}`, { align: 'left' });
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

                doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Datos del Cliente', col2X, currentY);
                doc.moveDown(0.5);
                doc.font('Helvetica').fontSize(10);
                doc.text(`Nombre: ${customerName}`, col2X);
                doc.text(`Email: ${email}`, col2X);
                doc.text(`Teléfono: ${phone}`, col2X);
                doc.moveDown(2);
                doc.y = Math.max(doc.y, currentY + 120);

                doc.moveDown();
                doc.rect(50, doc.y, 500, 110).fill('#F3F4F6').stroke();
                const tableStartY = doc.y - 100;
                doc.fillColor('#000000');

                // Cálculos financieros
                const price = car.price || 0;
                const downPaymentAmount = (price * (downPayment || 20)) / 100;
                const financedAmount = price - downPaymentAmount;
                const interestRate = 0.15;
                const monthlyInterest = interestRate / 12;
                const months = term || 48;
                const monthlyPayment = (financedAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));

                doc.fontSize(14).font('Helvetica-Bold').text('Propuesta de Financiamiento', 70, tableStartY + 15);
                doc.fontSize(10).font('Helvetica');
                doc.text(`Precio del Vehículo:`, 70, tableStartY + 40);
                doc.text(`$${price.toLocaleString()}`, 200, tableStartY + 40, { align: 'right', width: 100 });
                doc.text(`Enganche (${downPayment}%):`, 70, tableStartY + 55);
                doc.text(`-$${downPaymentAmount.toLocaleString()}`, 200, tableStartY + 55, { align: 'right', width: 100 });
                doc.font('Helvetica-Bold').text(`Monto a Financiar:`, 70, tableStartY + 75);
                doc.text(`$${financedAmount.toLocaleString()}`, 200, tableStartY + 75, { align: 'right', width: 100 });

                doc.fontSize(12).text('Mensualidad Estimada', 350, tableStartY + 40);
                doc.fontSize(24).fillColor('#EA580C').text(`$${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 350, tableStartY + 60);
                doc.fontSize(10).fillColor('#666666').text(`a ${months} meses`, 350, tableStartY + 85);

                doc.end();

                await new Promise<void>((resolve, reject) => {
                    doc.on('end', () => resolve());
                    doc.on('error', reject);
                });

                pdfData = Buffer.concat(buffers);

                // 5. Enviar correo
                const emailOptions: any = {
                    to: email,
                    subject: `Cotización Oficial: ${car.make} ${car.carModel} (${car.year})`,
                    html: `
                    <div style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
                            <h2 style="color: #ea580c;">¡Tu cotización ya está aquí! 🏎️</h2>
                            <p>Hola <strong>${customerName}</strong>,</p>
                            <p>Adjunto encontrarás la cotización oficial para el <strong>${car.year} ${car.make} ${car.carModel}</strong>.</p>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 5px 0;">💰 Precio: <strong>$${car.price.toLocaleString()}</strong></p>
                                <p style="margin: 5px 0;">📅 Mensualidad estimada: <strong>$${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> a ${months} meses</p>
                            </div>
                            <p>Un asesor se pondrá en contacto contigo pronto.</p>
                        </div>
                    </div>`,
                    attachments: pdfData ? [{
                        filename: `Cotizacion_${car.make}_${car.carModel}.pdf`,
                        content: pdfData,
                        contentType: 'application/pdf'
                    }] : []
                };

                await EmailService.sendEmail(emailOptions);

                // Admin notification
                await EmailService.sendAdminNotification(
                    'Nuevo Lead Generado 🚀',
                    `Nuevo lead: ${customerName} (${email}) para ${car.fullName}`
                );

                console.log(`✅ Background process complete for quote ${newQuote._id}`);

            } catch (bgError) {
                console.error(`❌ Background process failed for quote ${newQuote._id}:`, bgError);
            }
        })();

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
