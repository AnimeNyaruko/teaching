/* eslint-disable @typescript-eslint/no-explicit-any */
import sql from "@/utils/database";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ person: string }> },
) {
	const person = (await params).person;

	const data =
		await sql`select id,hwname,pname,type,status,statusmessage,deadlines,description from homeworks where pname=${person}`;
	if (!data[0]) {
		return Response.json({ status: 404 });
	}
	console.log(data);
	return Response.json({
		status: 200,
		data: {
			pending: data.filter((hw: any) => hw.status === "pending") || [],
			success: data.filter((hw: any) => hw.status === "success") || [],
			failed: data.filter((hw: any) => hw.status === "failed") || [],
		},
	});
}
