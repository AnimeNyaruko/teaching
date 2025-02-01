import btb64 from "@/utils/tools";
import sql from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const requestData = await request.formData();

	const hwname = requestData.get("HomeworkName");
	const pname = requestData.get("PersonName");
	const type = requestData.get("type");

	const base64 = await btb64(requestData.get("file") as Blob);
	console.log(base64);
	const data =
		await sql`update homeworks set file = ${base64} where hwname = ${hwname} and pname = ${pname} and type = ${type} RETURNING *`;
	if (data.length > 0) return NextResponse.json({ status: 200 });
	return NextResponse.json({ status: 500 });
}
