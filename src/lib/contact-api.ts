export interface ViewNumberRequest {
  name: string;
  phone: string;
  entityId: string;
}

export interface ViewNumberResponse {
  displayNumber: string; // stph2
  whatsappNumber: string; // stph3
}

export async function viewNumber(
  req: ViewNumberRequest,
): Promise<ViewNumberResponse> {
  const formData = new FormData();
  formData.append("rfifromph", req.phone);
  formData.append("nurfiname", req.name);
  formData.append("rfilid", req.entityId);
  formData.append("rfisrc", "3");
  formData.append("reqid", "-1");
  formData.append("app", "vercel");

  const res = await fetch("/api/contact/view-number", {
    method: "POST",
    body: formData,
  });
  const data = (await res.json()) as { stph2?: string; stph3?: string };
  if (!data?.stph2 || !data?.stph3) {
    throw new Error("Invalid response from server");
  }
  return { displayNumber: data.stph2, whatsappNumber: data.stph3 };
}

export interface SendMessageRequest {
  email: string;
  message: string;
  name: string;
  phone: string;
  entityId: string;
}

export async function sendMessage(req: SendMessageRequest): Promise<void> {
  const formData = new FormData();
  formData.append("rfifrom", req.email);
  formData.append("rfimessage", req.message);
  formData.append("rfifromph", req.phone);
  formData.append("nurfiname", req.name);
  formData.append("rfilid", req.entityId);
  formData.append("rfisrc", "3");
  formData.append("reqid", "-1");
  formData.append("app", "vercel");

  const res = await fetch("/api/contact/send-message", {
    method: "POST",
    body: formData,
  });
  const data = (await res.json()) as { mess?: string };
  if (data.mess !== "sent") {
    throw new Error("Failed to send message");
  }
}
