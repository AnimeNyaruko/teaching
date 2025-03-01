/* eslint-disable @typescript-eslint/no-explicit-any */
import sql from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ person: string }> },
) {
	const person = (await params).person;

	if (person === "counts") {
		const Kdata = (
			await sql`select count(*) from homeworks where pname='khang' and (status='pending' or status='failed')`
		)[0].count;
		const Ndata = (
			await sql`select count(*) from homeworks where pname='ngân' and (status='pending' or status='failed')`
		)[0].count;
		return Response.json({
			status: 200,
			body: {
				Khang: Kdata,
				Ngân: Ndata,
			},
		});
	}

	const data =
		await sql`select * from homeworks where pname=${person} ORDER BY status,statusmessage,type,hwname DESC`;
	if (!data[0]) {
		return Response.json({ status: 404 });
	}
	return NextResponse.json({
		status: 200,
		data: {
			pending: data.filter((hw: any) => hw.status === "pending") || [],
			success: data.filter((hw: any) => hw.status === "success") || [],
			failed: data.filter((hw: any) => hw.status === "failed") || [],
		},
	});
}
