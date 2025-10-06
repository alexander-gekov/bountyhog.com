interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  options: string[];
  multiple: boolean;
}

interface TallyBlock {
  uuid: string;
  type: string;
  groupUuid: string;
  groupType: string;
  payload: any;
}

interface TallyFormRequest {
  status: "BLANK" | "DRAFT" | "PUBLISHED";
  blocks: TallyBlock[];
  settings?: {
    language?: string;
    hasProgressBar?: boolean;
    hasPartialSubmissions?: boolean;
    pageAutoJump?: boolean;
    saveForLater?: boolean;
    password?: string;
  };
  workspaceId?: string;
}

export function generateTallyBlocks(
  bountyTitle: string,
  bountyDescription: string,
  formFields: FormField[]
): TallyBlock[] {
  const blocks: TallyBlock[] = [];

  blocks.push({
    uuid: crypto.randomUUID(),
    type: "FORM_TITLE",
    groupUuid: crypto.randomUUID(),
    groupType: "TEXT",
    payload: {
      html: bountyTitle,
    },
  });

  if (bountyDescription && bountyDescription.trim()) {
    blocks.push({
      uuid: crypto.randomUUID(),
      type: "LABEL",
      groupUuid: crypto.randomUUID(),
      groupType: "LABEL",
      payload: {
        html: bountyDescription,
      },
    });
  }

  const fullNameGroupUuid = crypto.randomUUID();

  blocks.push({
    uuid: crypto.randomUUID(),
    type: "TITLE",
    groupUuid: fullNameGroupUuid,
    groupType: "QUESTION",
    payload: {
      html: "Full Name",
    },
  });
  blocks.push({
    uuid: crypto.randomUUID(),
    type: "INPUT_TEXT",
    groupUuid: fullNameGroupUuid,
    groupType: "QUESTION",
    payload: {
      isRequired: true,
      placeholder: "Enter your full name",
      hasMinCharacters: false,
      hasMaxCharacters: false,
      hasDefaultAnswer: false,
    },
  });

  const emailGroupUuid = crypto.randomUUID();
  blocks.push({
    uuid: crypto.randomUUID(),
    type: "TITLE",
    groupUuid: emailGroupUuid,
    groupType: "QUESTION",
    payload: {
      html: "Email Address",
    },
  });
  blocks.push({
    uuid: crypto.randomUUID(),
    type: "INPUT_EMAIL",
    groupUuid: emailGroupUuid,
    groupType: "QUESTION",
    payload: {
      isRequired: true,
      placeholder: "your.email@example.com",
      requireVerification: true,
      hasDefaultAnswer: false,
    },
  });

  // const resumeGroupUuid = crypto.randomUUID();
  // blocks.push({
  //   uuid: crypto.randomUUID(),
  //   type: "TITLE",
  //   groupUuid: resumeGroupUuid,
  //   groupType: "QUESTION",
  //   payload: {
  //     html: "Resume / CV",
  //   },
  // });
  // blocks.push({
  //   uuid: crypto.randomUUID(),
  //   type: "FILE_UPLOAD",
  //   groupUuid: resumeGroupUuid,
  //   groupType: "QUESTION",
  //   payload: {
  //     isRequired: true,
  //     allowedFiles: {
  //       extensions: ["pdf", "doc", "docx"],
  //     },
  //     hasMaxFiles: true,
  //     maxFiles: 1,
  //   },
  // });

  formFields.forEach((field) => {
    if (field.type === "CHECKBOXES") {
      const checkboxesGroupUuid = crypto.randomUUID();
      blocks.push({
        uuid: crypto.randomUUID(),
        type: "TITLE",
        groupUuid: checkboxesGroupUuid,
        groupType: "QUESTION",
        payload: {
          html: field.label,
        },
      });

      field.options.forEach((option: string, index: number) => {
        blocks.push({
          uuid: crypto.randomUUID(),
          type: "CHECKBOX",
          groupUuid: checkboxesGroupUuid,
          groupType: "CHECKBOXES",
          payload: {
            text: option,
            index,
            isFirst: index === 0,
            isLast: index === field.options.length - 1,
            isRequired: field.required,
          },
        });
      });
    } else if (field.type === "FILE_UPLOAD") {
      const fileGroupUuid = crypto.randomUUID();

      blocks.push({
        uuid: crypto.randomUUID(),
        type: "TITLE",
        groupUuid: fileGroupUuid,
        groupType: "QUESTION",
        payload: {
          html: field.label,
        },
      });

      blocks.push({
        uuid: crypto.randomUUID(),
        type: "FILE_UPLOAD",
        groupUuid: fileGroupUuid,
        groupType: "FILE_UPLOAD",
        payload: {
          isRequired: field.required,
          hasAllowedFiles: true,
          allowedFiles: {
            extensions: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
          },
          hasMaxFiles: true,
          maxFiles: field.multiple ? 5 : 1,
        },
      });
    } else if (field.type === "INPUT_TEXT" || field.type === "TEXTAREA") {
      const inputGroupUuid = crypto.randomUUID();
      blocks.push({
        uuid: crypto.randomUUID(),
        type: "TITLE",
        groupUuid: inputGroupUuid,
        groupType: "QUESTION",
        payload: {
          html: field.label,
        },
      });

      const payload: any = {
        isRequired: field.required,
        hasMinCharacters: false,
        hasMaxCharacters: false,
        hasDefaultAnswer: false,
      };
      if (field.placeholder) {
        payload.placeholder = field.placeholder;
      }

      blocks.push({
        uuid: crypto.randomUUID(),
        type: field.type,
        groupUuid: inputGroupUuid,
        groupType: field.type,
        payload,
      });
    }
  });

  return blocks;
}

export async function createTallyForm(
  bountyTitle: string,
  bountyDescription: string,
  formFields: FormField[],
  apiKey: string,
  workspaceId?: string
): Promise<{ id: string; url: string; password: string }> {
  const blocks = generateTallyBlocks(
    bountyTitle,
    bountyDescription,
    formFields
  );

  // openssl rand string max 8 chars;
  const password = crypto.randomUUID().substring(0, 10);

  const requestBody: TallyFormRequest = {
    status: "PUBLISHED",
    blocks,
    settings: {
      hasProgressBar: true,
      pageAutoJump: false,
      saveForLater: true,
      password: password,
    },
  };

  if (workspaceId) {
    requestBody.workspaceId = workspaceId;
  }

  console.log(JSON.stringify(requestBody, null, 2));

  const response = await fetch("https://api.tally.so/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody, null, 2),
  });

  console.log("Response status:", response.status);
  console.log("Response statusText:", response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Tally API Error Response:", errorText);
    let errorMessage = response.statusText;
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.message || error.error || errorText;
    } catch (e) {
      errorMessage = errorText;
    }
    throw new Error(`Failed to create Tally form: ${errorMessage}`);
  }

  const data = await response.json();
  console.log("Tally API Success Response:", JSON.stringify(data, null, 2));

  if (!data.id) {
    throw new Error("Tally API did not return a form ID");
  }

  return {
    id: data.id,
    url: `https://tally.so/r/${data.id}`,
    password: password,
  };
}
