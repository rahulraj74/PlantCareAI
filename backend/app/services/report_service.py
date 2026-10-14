import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class ReportService:
    @staticmethod
    def generate_pdf(diagnosis_data: dict) -> io.BytesIO:
        """
        Builds a diagnostic PDF document using ReportLab.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()

        # Custom Agricultural Typography Styles
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#14532d')
        )
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#64748b')
        )
        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#166534'),
            spaceBefore=12,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor('#1e293b')
        )
        disclaimer_style = ParagraphStyle(
            'Disclaimer',
            parent=styles['Italic'],
            fontName='Helvetica-Oblique',
            fontSize=8,
            leading=11,
            textColor=colors.HexColor('#475569')
        )

        elements = []

        # 1. Header Banner
        elements.append(Paragraph("PlantCare AI — Agricultural Diagnostic Report", title_style))
        elements.append(Paragraph(f"Autonomous Leaf Pathology & Decision-Support System • Generated on {datetime.now().strftime('%B %d, %Y %H:%M UTC')}", subtitle_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#22c55e'), spaceAfter=15))

        # 2. Key Metadata Table
        diag_id = diagnosis_data.get("id") or diagnosis_data.get("diagnosis_id", "N/A")
        crop = diagnosis_data.get("crop", "Tomato")
        disease_name = diagnosis_data.get("disease_name", "Unknown Condition")
        confidence = diagnosis_data.get("confidence", 0.0)
        conf_pct = f"{round(confidence * 100, 1)}%"
        reliability = "Reliable Classification" if diagnosis_data.get("is_reliable", True) else "Uncertain / Advisory"

        meta_data = [
            [
                Paragraph("<b>Diagnosis Record ID:</b>", body_style), Paragraph(f"#{diag_id}", body_style),
                Paragraph("<b>Evaluated Crop:</b>", body_style), Paragraph(str(crop), body_style)
            ],
            [
                Paragraph("<b>Predicted Pathology:</b>", body_style), Paragraph(f"<b>{disease_name}</b>", body_style),
                Paragraph("<b>Confidence Score:</b>", body_style), Paragraph(f"{conf_pct} ({reliability})", body_style)
            ]
        ]

        t = Table(meta_data, colWidths=[130, 130, 130, 140])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 15))

        # 3. Uncertainty Notice (if applicable)
        uncertainty_note = diagnosis_data.get("uncertainty_note")
        if uncertainty_note or not diagnosis_data.get("is_reliable", True):
            note_text = uncertainty_note or "Confidence is below the verified decision threshold. Physical extension inspection recommended."
            elements.append(Paragraph("<b>Diagnostic Advisory Notice:</b>", section_heading))
            elements.append(Paragraph(note_text, body_style))
            elements.append(Spacer(1, 10))

        # 4. Symptoms Profile
        disease_info = diagnosis_data.get("disease_info", {})
        symptoms = disease_info.get("symptoms", []) if isinstance(disease_info, dict) else []
        if symptoms:
            elements.append(Paragraph("Documented Field Symptoms", section_heading))
            for sym in symptoms:
                elements.append(Paragraph(f"• {sym}", body_style))
            elements.append(Spacer(1, 10))

        # 5. Management & Cultural Controls
        management = disease_info.get("management", []) if isinstance(disease_info, dict) else []
        if management:
            elements.append(Paragraph("Recommended Agronomic Management & Cultural Measures", section_heading))
            for i, mgmt in enumerate(management, 1):
                elements.append(Paragraph(f"<b>{i}.</b> {mgmt}", body_style))
            elements.append(Spacer(1, 10))

        # 6. Official Extension Sources
        sources = disease_info.get("sources", []) if isinstance(disease_info, dict) else []
        if sources:
            elements.append(Paragraph("Extension Research References", section_heading))
            elements.append(Paragraph(" • ".join(sources), body_style))
            elements.append(Spacer(1, 15))

        # 7. Academic & Regulatory Disclaimer
        elements.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#e2e8f0'), spaceAfter=10))
        disclaimer = (
            "<b>Educational & Decision-Support Disclaimer:</b> This diagnostic report was autonomously generated by PlantCare AI "
            "using convolutional transfer learning (MobileNetV2). Machine learning predictions do not constitute certified agricultural "
            "laboratory certification. Do not apply commercial restricted chemical pesticides solely on automated output. Always verify "
            "symptoms with a licensed agronomist or your local university cooperative extension office."
        )
        elements.append(Paragraph(disclaimer, disclaimer_style))

        # Build document
        doc.build(elements)
        buffer.seek(0)
        return buffer

report_service = ReportService()
