// 基于 03-database-model.md 定义的前端实体类型
// 这些类型与后端返回的 DTO (Data Transfer Object) 保持一致

export interface User {
  id: number;
  phone: string;
  nickname: string;
  avatarUrl?: string;
  role: number; // 0普通用户, 1管理员
  status: number; // 1正常, 0冻结
  createdAt?: string;
}

export interface ItemImage {
  id: number;
  itemId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface Item {
  id: number;
  sellerId: number;
  title: string;
  category: string;
  conditionLevel: number; // 1-5
  price: number;
  description: string;
  city: string;
  status: number; // 0待审核,1在售,2交易中,3已售出,4已下架,5审核拒绝
  rejectReason?: string;
  images?: ItemImage[];
  publishedAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: number;
  itemId: number;
  buyerId: number;
  sellerId: number;
  status: number; // 1进行中,0已关闭
  item?: Item;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface Trade {
  id: number;
  itemId: number;
  buyerId: number;
  sellerId: number;
  conversationId: number;
  agreedPrice: number;
  meetupLocation: string;
  meetupTime?: string;
  status: number; // 0已发起,1待卖家确认,2进行中,3已完成,4已取消
  cancelReason?: string;
  createdAt: string;
}

// 统一 API 响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
