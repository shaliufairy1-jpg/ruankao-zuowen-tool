import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EvaluationResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    totalScore: {
      type: Type.NUMBER,
      description: "总分 (满分75分). 及格分45.",
    },
    isPass: {
      type: Type.BOOLEAN,
      description: "是否及格 (score >= 45)",
    },
    summary: {
      type: Type.STRING,
      description: "总体评价，200字以内",
    },
    dimensions: {
      type: Type.ARRAY,
      description: "5个维度的详细评分",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "维度名称，例如：项目背景、理论应用、逻辑结构、语言表达、切合题意" },
          score: { type: Type.NUMBER, description: "该维度的得分" },
          fullMark: { type: Type.NUMBER, description: "该维度满分" },
          comment: { type: Type.STRING, description: "针对该维度的简短评语" },
        },
        required: ["name", "score", "fullMark", "comment"],
      },
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "论文的优点列表",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "论文的不足之处列表",
    },
    suggestions: {
      type: Type.ARRAY,
      description: "具体的修改和优化建议，必须包含原文引用",
      items: { 
        type: Type.OBJECT,
        properties: {
          point: { type: Type.STRING, description: "具体的修改建议" },
          quote: { type: Type.STRING, description: "原文中存在问题的具体句子引用，如果没有具体句子则留空字符串" }
        },
        required: ["point", "quote"]
      },
    },
  },
  required: ["totalScore", "isPass", "summary", "dimensions", "strengths", "weaknesses", "suggestions"],
};

export const analyzeEssay = async (essayContent: string): Promise<EvaluationResult> => {
  if (!essayContent || essayContent.length < 50) {
    throw new Error("论文内容太短，无法进行有效批改。");
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    你是一位资深的中国计算机技术与软件专业技术资格（水平）考试（软考）高级-信息系统项目管理师（高项）阅卷专家。
    请根据以下标准对用户提供的论文进行严格批改。

    **评分标准 (满分75分，45分及格):**
    1. **切合题意 (15分):** 是否紧扣项目管理主题，是否回应了子题目要求。
    2. **项目背景 (10分):** 项目背景是否真实、具体，金额、工期、角色描述是否合理。
    3. **理论与实践结合 (25分):** 是否正确运用了PMBOK（项目管理知识体系）的过程组和知识领域，是否有具体的实践举措，而非单纯堆砌理论。"我"在项目中的作用是否突出。
    4. **逻辑结构 (15分):** 摘要是否概括得当，正文结构（背景、过渡、核心过程、结尾）是否清晰严谨。
    5. **语言与格式 (10分):** 语言是否流畅，专业术语是否准确，字数是否符合一般要求。

    **任务:**
    阅读提供的论文内容，输出JSON格式的评分报告。
    
    **特别要求:**
    在给出【建议】(suggestions)时，请务必从原文中摘录出具体的句子(quote)来佐证你的建议。例如："项目背景描述过于笼统"，并在quote字段中引用"本项目建设规模很大..."这句话。如果建议是针对全文的，quote可以留空。

    **论文内容:**
    ${essayContent}
  `;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, 
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("模型未返回有效结果");
    }

    const evaluation: EvaluationResult = JSON.parse(resultText);
    return evaluation;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("AI 批改服务暂时不可用，请稍后重试。");
  }
};