import { client } from "./api/client";
import { endpoints } from "./api/endpoints";

export interface ReportResult {
    pdfData: Uint8Array;
    fileName: string;
}

class ResourceService {
    async getMedicalReport(fromDate: Date, toDate?: Date): Promise<ReportResult> {
        try {
            const format = (d: Date) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            const start = format(fromDate);
            const end = toDate ? format(toDate) : undefined;

            const response = await client.get(endpoints.reports.doctor(start, end), {
                responseType: 'arraybuffer',
            });

            if (response.status === 200 && response.data?.byteLength > 100) {
                const pdfData = new Uint8Array(response.data);
                const fileName = `medical_report_${start}_to_${end || 'today'}.pdf`;
                return { pdfData, fileName };
            }

            throw new Error("Failed to generate report - invalid data received");
        } catch (error: any) {
            console.error('Report API Error:', error);
            throw new Error(error?.message || "Something went wrong while generating the report.");
        }
    }

    async getDoctorCard(): Promise<ReportResult> {
        try {
            const response = await client.post(endpoints.doctor.card.generateAndSend, {}, {
                responseType: 'arraybuffer',
            });

            if (response.status === 200) {
                const pdfData = new Uint8Array(response.data);

                // Try to extract filename from Content-Disposition header
                let fileName = "appointment-booking-card.pdf";
                const contentDisposition = response.headers?.['content-disposition'];
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
                    if (fileNameMatch && fileNameMatch[1]) {
                        fileName = fileNameMatch[1];
                    }
                }

                return { pdfData, fileName };
            }

            throw new Error("Failed to generate doctor card");
        } catch (error: any) {
            console.error('Doctor Card API Error:', error);
            throw new Error(error?.message || "Something went wrong while generating the card.");
        }
    }
}

export const resourceService = new ResourceService();
export default resourceService;
