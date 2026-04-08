import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Plus, Send, ChevronLeft, Image, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BottomTabBar from "@/components/BottomTabBar";
import { dummyPosts, type CommunityPost, type CommunityComment } from "@/data/communityData";

type BoardTab = "free" | "anonymous";

const CommunityPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<BoardTab>("free");
  const [posts, setPosts] = useState<CommunityPost[]>(dummyPosts);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showWrite, setShowWrite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  // Write form
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [writePhotos, setWritePhotos] = useState<string[]>([]);

  // Comment
  const [commentText, setCommentText] = useState("");

  const filteredPosts = posts.filter((p) => p.board === activeTab);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
          : p
      )
    );
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) =>
        prev ? { ...prev, likes: prev.likedByMe ? prev.likes - 1 : prev.likes + 1, likedByMe: !prev.likedByMe } : prev
      );
    }
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;
    setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
    setSelectedPost(null);
    setShowDeleteConfirm(false);
    toast.success("게시글이 삭제되었습니다.");
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPost) return;
    const post = posts.find((p) => p.id === selectedPost.id);
    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      author: post?.board === "anonymous" ? "익명" : "나",
      content: commentText.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPost.id ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setSelectedPost((prev) =>
      prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
    );
    setCommentText("");
  };

  const handlePublish = () => {
    if (!writeTitle.trim() || !writeContent.trim()) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }
    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      board: activeTab,
      title: writeTitle.trim(),
      content: writeContent.trim(),
      author: activeTab === "anonymous" ? "익명" : "나",
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
      comments: [],
      photos: writePhotos,
      likedByMe: false,
      isMine: true,
    };
    setPosts((prev) => [newPost, ...prev]);
    setShowWrite(false);
    setWriteTitle("");
    setWriteContent("");
    setWritePhotos([]);
    toast.success("게시글이 등록되었습니다.");
  };

  const handlePhotoAdd = () => {
    if (writePhotos.length >= 3) {
      toast.error("사진은 최대 3장까지 첨부할 수 있습니다.");
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setWritePhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Fullscreen photo viewer
  if (fullscreenPhoto) {
    return (
      <div
        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
        onClick={() => setFullscreenPhoto(null)}
      >
        <button className="absolute top-4 right-4 text-white/80 hover:text-white">
          <X className="w-7 h-7" />
        </button>
        <img src={fullscreenPhoto} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
      </div>
    );
  }

  // Detail view
  if (selectedPost) {
    const post = posts.find((p) => p.id === selectedPost.id) || selectedPost;
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
          <button onClick={() => setSelectedPost(null)} className="mr-3">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-accent-foreground/70">
              <span className="font-medium">{post.author}</span>
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
          {post.isMine && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </header>

        <div className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
          <h2 className="text-xl font-bold text-foreground mb-2">{post.title}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {post.photos.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {post.photos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setFullscreenPhoto(url)}
                  className="shrink-0"
                >
                  <img src={url} alt="" className="w-24 h-24 rounded-lg object-cover border border-border" />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => handleLike(post.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6 transition-colors",
              post.likedByMe
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-border text-muted-foreground"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", post.likedByMe && "fill-current")} />
            {post.likedByMe ? "❤️" : "🤍"} {post.likes}
          </button>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold text-foreground mb-3">💬 댓글 {post.comments.length}</p>
            <div className="space-y-3 mb-4">
              {post.comments.map((c) => (
                <div key={c.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground">{c.createdAt}</span>
                  </div>
                  <p className="text-xs text-foreground">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment input */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-background border-t border-border px-4 py-3 flex gap-2 z-50">
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <Button
            size="icon"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Delete confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="max-w-[320px] rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>삭제된 글은 복구할 수 없습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePost}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold flex-1">커뮤니티</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["free", "anonymous"] as BoardTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold text-center transition-colors relative",
              activeTab === tab ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {tab === "free" ? "자유게시판" : "익명게시판"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex-1 px-4 pt-3 pb-24 space-y-2 overflow-y-auto">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">아직 게시글이 없습니다</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="w-full text-left bg-card border border-border rounded-xl p-3.5 hover:bg-muted/30 transition-colors flex gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">{post.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{post.content}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.createdAt}</span>
                  <span className="flex items-center gap-0.5">
                    🤍 {post.likes}
                  </span>
                  <span className="flex items-center gap-0.5">
                    💬 {post.comments.length}
                  </span>
                </div>
              </div>
              {post.photos.length > 0 && (
                <img
                  src={post.photos[0]}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                />
              )}
            </button>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowWrite(true)}
        className="fixed bottom-20 right-[calc(50%-195px+16px)] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <span className="text-lg">✏️</span>
      </button>

      {/* Write dialog */}
      <Dialog open={showWrite} onOpenChange={setShowWrite}>
        <DialogContent className="max-w-[360px] rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {activeTab === "free" ? "자유게시판" : "익명게시판"} 글쓰기
            </DialogTitle>
            <DialogDescription className="text-xs">
              {activeTab === "anonymous"
                ? "작성자명은 '익명'으로 표시됩니다."
                : "게시글을 작성해주세요."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-1">
            <Input
              value={writeTitle}
              onChange={(e) => setWriteTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="text-sm"
            />
            <Textarea
              value={writeContent}
              onChange={(e) => setWriteContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="text-sm min-h-[200px] resize-none"
            />

            {/* Photo attach */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePhotoAdd}
                className="flex items-center gap-1.5 text-xs text-primary font-semibold px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
              >
                <Image className="w-3.5 h-3.5" />
                사진 첨부 ({writePhotos.length}/3)
              </button>
            </div>
            {writePhotos.length > 0 && (
              <div className="flex gap-2">
                {writePhotos.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    <button
                      onClick={() => setWritePhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handlePublish}
              disabled={!writeTitle.trim() || !writeContent.trim()}
              className="w-full h-11 rounded-xl font-bold"
            >
              등록
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomTabBar />
    </div>
  );
};

export default CommunityPage;
