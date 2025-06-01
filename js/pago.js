document.addEventListener('DOMContentLoaded', () => {
    // Animate payment methods on load
    anime({
        targets: '.payment-method',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
    });

    function generateOperationNumber() {
        const prefix = Math.random() < 0.5 ? 'OP' : 'TR';
        const numbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const suffix = letters.charAt(Math.floor(Math.random() * letters.length)) +
                      letters.charAt(Math.floor(Math.random() * letters.length));
        return `${prefix}-${numbers}-${suffix}`;
    }

    const paymentMethods = document.querySelectorAll('.payment-method');
    const transferDetails = document.getElementById('transfer-details');
    const yapeDetails = document.getElementById('yape-details');

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            method.classList.add('active');

            // Hide all payment details
            transferDetails.style.display = 'none';
            yapeDetails.style.display = 'none';

            // Show selected payment details with animation
            const selectedDetails = method.dataset.method === 'transfer' ? transferDetails : yapeDetails;
            selectedDetails.style.display = 'block';

            anime({
                targets: selectedDetails,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo'
            });

            // Generate and display new operation number
            const form = selectedDetails.querySelector('form');
            const operationInput = form.querySelector('.operation-input');
            const newOperationNumber = generateOperationNumber();
            
            operationInput.value = newOperationNumber;
            
            anime({
                targets: operationInput,
                backgroundColor: ['#e8f5e9', '#f8f9fa'],
                duration: 800,
                easing: 'easeOutQuad'
            });
        });
    });

    // Copy button functionality
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = '¡Copiado!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);

                // Animation for copy feedback
                anime({
                    targets: button,
                    scale: [1, 1.1, 1],
                    duration: 400,
                    easing: 'easeInOutQuad'
                });
            });
        });
    });

    // Form submission animation
    ['transfer-form', 'yape-form'].forEach(formId => {
        document.getElementById(formId)?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const modal = document.getElementById('paymentModal');
            const form = e.target;
            const operationNumber = form.querySelector('.operation-input').value;
            const amount = formId === 'transfer-form' ? 
                          (form.querySelector('input[type="number"]')?.value || '0.00') : 
                          null;
            const method = formId === 'transfer-form' ? 'Transferencia BCP' : 'Yape';
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('es-PE');
            const timeStr = now.toLocaleTimeString('es-PE');

            modal.style.display = 'flex';

            // Animate modal appearance and process payment
            processPaymentAnimation(modal, {
                method,
                operationNumber,
                amount,
                date: dateStr,
                time: timeStr,
                isYape: formId === 'yape-form'
            });
        });
    });

    function processPaymentAnimation(modal, paymentDetails) {
        anime({
            targets: '.modal-content',
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutQuad'
        });

        // Animate loader
        const loaderAnimation = anime({
            targets: '.loader',
            rotate: '360deg',
            duration: 1000,
            loop: true,
            easing: 'linear'
        });

        // Simulate payment processing
        setTimeout(() => {
            loaderAnimation.pause();
            document.querySelector('.modal-text').textContent = '¡Pago completado con éxito!';
            document.querySelector('.loader').style.display = 'none';
            
            // Show receipt details
            const receiptDetails = document.querySelector('.receipt-details');
            receiptDetails.style.display = 'block';
            
            // Fill payment details
            document.getElementById('paymentDate').textContent = paymentDetails.date;
            document.getElementById('paymentTime').textContent = paymentDetails.time;
            document.getElementById('paymentMethod').textContent = paymentDetails.method;
            document.getElementById('operationNumber').textContent = paymentDetails.operationNumber;
            
            // Only show amount for transfer payments
            const amountElement = document.getElementById('paymentAmount').parentElement;
            if (paymentDetails.isYape) {
                amountElement.style.display = 'none';
            } else {
                amountElement.style.display = 'block';
                document.getElementById('paymentAmount').textContent = paymentDetails.amount;
            }

            // Animate receipt appearance
            anime({
                targets: '.receipt-details',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
        }, 2000);

        // PDF Generation
        document.getElementById('downloadPdf').addEventListener('click', () => {
            generatePDF(paymentDetails);
        });
    }

    function generatePDF(paymentDetails) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Define colors
        const primaryColor = '#2196F3';
        const secondaryColor = '#666666';
        
        // Add header with background
        doc.setFillColor(245, 245, 245);
        doc.rect(0, 0, 210, 40, 'F');
        
        // Add logo
        const logoImg = new Image();
        logoImg.src = '/Resource/Logo/logo.png';
        doc.addImage(logoImg, 'PNG', 20, 10, 30, 30);
        
        // Company info header
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('POLYLINE S.A.C', 60, 25);
        
        // Receipt title
        doc.setFillColor(primaryColor);
        doc.rect(0, 50, 210, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('COMPROBANTE DE PAGO', 105, 58, { align: 'center' });
        
        // Payment details section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        
        const startY = 80;
        const leftMargin = 20;
        const rightCol = 100;
        
        // Reference number box
        doc.setFillColor(245, 245, 245);
        doc.rect(leftMargin - 5, startY - 15, 180, 20, 'F');
        doc.setTextColor(primaryColor);
        doc.text(`N° de Operación: ${paymentDetails.operationNumber}`, leftMargin, startY);
        
        // Payment details in two columns
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('DETALLES DEL PAGO', leftMargin, startY + 20);
        
        const details = [
            ['Fecha:', paymentDetails.date],
            ['Hora:', paymentDetails.time],
            ['Método de pago:', paymentDetails.method]
        ];
        
        if (!paymentDetails.isYape) {
            details.push(['Monto:', `S/ ${paymentDetails.amount}`]);
        }
        
        // Add details in a styled table format
        let currentY = startY + 30;
        details.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, leftMargin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(value, leftMargin + 40, currentY);
            currentY += 10;
        });
        
        // Add divider line
        currentY += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(leftMargin, currentY, 190, currentY);
        
        // Add footer
        doc.setFontSize(9);
        doc.setTextColor(secondaryColor);
        currentY += 20;
        doc.text('Este documento es un comprobante de pago electrónico válido.', 105, currentY, { align: 'center' });
        doc.text('POLYLINE S.A.C agradece su preferencia.', 105, currentY + 5, { align: 'center' });
        
        // Add QR code corner (simulated)
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(160, 80, 30, 30, 3, 3, 'F');
        
        // Save the PDF
        doc.save(`comprobante-${paymentDetails.operationNumber}.pdf`);
    }

    // Add modal close functionality
    document.querySelector('.modal-close').addEventListener('click', () => {
        const modal = document.getElementById('paymentModal');
        
        anime({
            targets: '.modal-content',
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                modal.style.display = 'none';
                // Reset modal state
                document.querySelector('.loader').style.display = 'block';
                document.querySelector('.modal-text').textContent = 'Procesando pago...';
                document.querySelector('.receipt-details').style.display = 'none';
            }
        });
    });
});
