import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import { EmailService } from '../services/emailService';
import Car from '../models/Car';

export const createQuote = async (req: Request, res: Response) => {
    try {
        const { carId, customerName, email, phone, downPayment, term } = req.body;

        // 1. Obtener detalles del auto
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // 2. Descargar imagen del auto si existe
        let imageBuffer: Buffer | null = null;
        try {
            if (car.image && (car.image.startsWith('http') || car.image.startsWith('https'))) {
                const response = await axios.get(car.image, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(response.data);
            }
        } catch (error) {
            console.warn('Could not download car image for PDF:', error);
        }

        // 3. Generar el PDF en memoria
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
           .text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'center' });
           
        doc.moveDown();
        doc.lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#EA580C').stroke();
        doc.moveDown();

        // Imagen del Auto
        if (imageBuffer) {
            // Centrar imagen
            const imgWidth = 400;
            const x = (doc.page.width - imgWidth) / 2;
            doc.image(imageBuffer, x, doc.y, { width: imgWidth });
            doc.moveDown(14); // Espacio suficiente para la imagen
        }

        // Vehículo
        const startY = doc.y;
        
        doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold')
           .text(`${car.year} ${car.make} ${car.carModel}`, { align: 'left' });
        
        doc.fillColor('#EA580C').fontSize(16)
           .text(`$${car.price.toLocaleString()}`, { align: 'left' });
        
        doc.moveDown();

        // Especificaciones y Datos del Cliente (en columnas)
        const col1X = 50;
        const col2X = 300;
        const currentY = doc.y;

        // Columna 1: Especificaciones
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
            doc.font('Helvetica-Oblique').text(car.description.substring(0, 100) + '...', { width: 220 });
        }

        // Columna 2: Datos del Cliente
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Datos del Cliente', col2X, currentY);
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10);
        doc.text(`Nombre: ${customerName}`, col2X);
        doc.text(`Email: ${email}`, col2X);
        doc.text(`Teléfono: ${phone}`, col2X);
        
        doc.moveDown(2);
        
        // Espacio para alinear abajo de las columnas
        doc.y = Math.max(doc.y, currentY + 120); 

        // Características (Features)
        if (car.features && car.features.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Características Destacadas');
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(10);
            
            // Listar features en 2 columnas si son muchos
            const featuresText = car.features.join(', ');
            doc.text(featuresText, { align: 'justify' });
            doc.moveDown();
        }

        // Tabla Financiera
        doc.moveDown();
        doc.rect(50, doc.y, 500, 110).fill('#F3F4F6').stroke();
        
        const tableStartY = doc.y - 100; // Ajuste manual porque rect no mueve cursor
        doc.fillColor('#000000'); // Reset color
        
        doc.fontSize(14).font('Helvetica-Bold').text('Propuesta de Financiamiento', 70, tableStartY + 15);
        
        const price = car.price || 0;
        const downPaymentAmount = (price * (downPayment || 20)) / 100;
        const financedAmount = price - downPaymentAmount;
        const interestRate = 0.15; // 15% anual fijo para ejemplo
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

        // Resultado Mensualidad (lado derecho destacado)
        doc.fontSize(12).text('Mensualidad Estimada', 350, tableStartY + 40);
        doc.fontSize(24).fillColor('#EA580C').text(`$${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 350, tableStartY + 60);
        doc.fontSize(10).fillColor('#666666').text(`a ${months} meses`, 350, tableStartY + 85);

        // Footer
        doc.y = 700; // Posicion absoluta al final
        doc.fontSize(8).fillColor('#999999').text('Esta cotización es de carácter informativo y no representa una oferta vinculante. Sujeto a aprobación de crédito. Precios y tasas pueden cambiar sin previo aviso.', 50, 700, { align: 'center', width: 500 });
        doc.text('VeloDrive - El placer de conducir.', { align: 'center' });

        // Finalizar PDF
        doc.end();

        // Esperar buffer
        await new Promise<void>((resolve) => {
            doc.on('end', () => resolve());
        });

        const pdfData = Buffer.concat(buffers);

        // 4. Enviar correo
        await EmailService.sendEmail({
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
  .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">VELO<span>DRIVE</span></div>
    </div>
    
    <div class="content">
      <div class="greeting">Hola ${customerName},</div>
      
      <p>Gracias por tu interés en nuestros vehículos exclusivos. Hemos recibido tu solicitud y preparado una cotización personalizada especialmente para ti.</p>
      
      <div class="car-summary">
        <div class="car-details">
          <h3>${car.year} ${car.make} ${car.model}</h3>
          <div class="car-price">$${car.price.toLocaleString()}</div>
          <div class="car-specs">
            ${car.transmission === 'a' ? 'Automática' : 'Manual'} • ${car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)} • ${car.cylinders} Cilindros
          </div>
        </div>
      </div>

      <div class="attachment-box">
        <strong>📎 Cotización PDF Adjunta:</strong><br>
        Encontrarás un archivo PDF adjunto a este correo con el desglose financiero completo, opciones de pago y especificaciones técnicas detalladas.
      </div>

      <p>Uno de nuestros asesores expertos se pondrá en contacto contigo al número <strong>${phone}</strong> en las próximas horas para discutir las opciones de financiamiento y agendar una prueba de manejo.</p>
      
      <p style="margin-top: 30px;">Estamos aquí para ayudarte a encontrar el auto de tus sueños.</p>
      
      <p style="margin-top: 40px; font-weight: 600;">Atentamente,<br>El equipo de VeloDrive</p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} VeloDrive Inc. Todos los derechos reservados.</p>
      <p>Este correo fue enviado a ${email} como respuesta a una solicitud de cotización.</p>
      <p>VeloDrive • Avenida Principal 123 • Ciudad de México</p>
    </div>
  </div>
</body>
</html>
            `,
            attachments: [
                {
                    filename: `Cotizacion_${car.make}_${car.carModel}.pdf`,
                    content: pdfData,
                    contentType: 'application/pdf'
                }
            ]
        });
        
        // Copia Admin
        await EmailService.sendAdminNotification(
            'Nuevo Lead Generado', 
            `Cliente: ${customerName}<br>Email: ${email}<br>Auto: ${car.fullName}<br>Valor: $${car.price}`
        );

        res.status(200).json({ message: 'Cotización enviada con éxito' });

    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ message: 'Error generando la cotización' });
    }
};
