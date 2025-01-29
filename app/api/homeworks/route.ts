import supabase from "@/utils/supabase";

export async function GET() {
	// const type = "Array";
	const { data, error } = await supabase.from("homeworks").select();
	// .eq("type", "Array");
	return Response.json({ data, error });
}
