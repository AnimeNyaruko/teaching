import btb64 from "@/utils/tools";
import sql from "@/utils/database";

export async function POST(request: Request) {
	const requestData = await request.formData();

	const hwname = requestData.get("HomeworkName");
	const pname = requestData.get("PersonName");
	const type = requestData.get("type");

	const base64 = await btb64(requestData.get("file") as Blob);
	sql`update homeworks set file = ${base64} where hwname = ${hwname} and pname = ${pname} and type = ${type}`
		.then(() => {
			return Response.json({ status: 200 });
		})
		.catch(() => {
			return Response.json({ status: 500 });
		});
}
