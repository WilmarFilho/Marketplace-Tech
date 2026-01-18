"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mail, User, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { getVendorMessages, markMessageAsRead } from "@/app/(main)/dashboard/actions";
import Link from "next/link";

interface Message {
  id: string;
  created_at: string | null;
  email: string;
  full_name: string;
  message_content: string;
  phone: string;
  product_id: string | null;
  read: boolean | null;
  vendor_id: string;
  product?: {
    title: string;
    id: string;
  } | null;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function MessagesModal({ isOpen, onClose, userId }: MessagesModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVendorMessages(userId);
      setMessages(data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      setMarkingRead(messageId);
      console.log('Marcando mensagem como lida:', messageId);
      
      const result = await markMessageAsRead(messageId);
      console.log('Resultado da operação:', result);
      
      // Atualizar o estado local
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
      
      // Forçar refresh das mensagens após update
      setTimeout(() => {
        fetchMessages();
      }, 500);
      
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      alert('Erro ao marcar mensagem como lida. Tente novamente.');
    } finally {
      setMarkingRead(null);
    }
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone;
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 max-[600px]:p-2" 
      onClick={handleBackdropClick}
    >
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 max-[600px]:max-w-full max-[600px]:max-h-[95vh] max-[600px]:rounded-lg">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md text-white p-6 border-b border-white/10 max-[600px]:p-4">
          <div className="flex items-center justify-between max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3">
            <div className="flex items-center gap-3 max-[600px]:gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm max-[600px]:w-8 max-[600px]:h-8">
                <Mail className="h-5 w-5 max-[600px]:h-4 max-[600px]:w-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold max-[600px]:text-lg">Mensagens Recebidas</h3>
                <p className="text-white/80 text-sm max-[600px]:text-xs">
                  {messages.length} mensagem{messages.length !== 1 ? 's' : ''} total
                  {unreadCount > 0 && ` • ${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full max-[600px]:h-7 max-[600px]:w-7 max-[600px]:self-end max-[600px]:absolute max-[600px]:top-3 max-[600px]:right-3"
            >
              <X className="h-5 w-5 max-[600px]:h-4 max-[600px]:w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] max-[600px]:max-h-[calc(95vh-140px)] overflow-y-auto bg-black/20 backdrop-blur-md p-6 max-[600px]:p-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/80">Carregando mensagens...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 max-[600px]:py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm max-[600px]:w-12 max-[600px]:h-12">
                <MessageSquare className="h-8 w-8 text-white/60 max-[600px]:h-6 max-[600px]:w-6" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2 max-[600px]:text-base">Nenhuma mensagem</h4>
              <p className="text-white/70 max-[600px]:text-sm">Você ainda não recebeu mensagens sobre seus produtos.</p>
            </div>
          ) : (
            <div className="space-y-4 max-[600px]:space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`backdrop-blur-md rounded-xl p-6 transition-all duration-200 border max-[600px]:p-4 max-[600px]:rounded-lg ${
                    !message.read 
                      ? 'border-white/5 bg-white/5 shadow-lg' 
                      : 'border-white/20 bg-white/10 hover:bg-white/15'
                  }`}
                >
                  {/* Header da mensagem */}
                  <div className="flex items-start justify-between mb-4 max-[600px]:mb-3 max-[600px]:flex-col max-[600px]:gap-2">
                    <div className="flex items-center gap-3 max-[600px]:gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center max-[600px]:w-8 max-[600px]:h-8">
                          <User className="h-5 w-5 text-white max-[600px]:h-4 max-[600px]:w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white max-[600px]:text-sm">{message.full_name}</h4>
                          <div className="flex items-center gap-4 text-sm text-white/70 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-1 max-[600px]:text-xs">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 max-[600px]:h-2 max-[600px]:w-2" />
                              {message.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 max-[600px]:h-2 max-[600px]:w-2" />
                              {formatPhone(message.phone)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 max-[600px]:w-full max-[600px]:justify-start">
                        {!message.read && (
                          <Badge variant="default" className="bg-[#ECF230]/80 text-black backdrop-blur-sm border-yellow-400/30 max-[600px]:text-xs">
                            Nova
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-white/60 max-[600px]:text-[10px]">
                      </div>
                    </div>
                  </div>

                  {/* Produto relacionado */}
                  {message.product && (
                    <div className="mb-4 p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 max-[600px]:mb-3 max-[600px]:p-2">
                      <div className="flex items-center justify-between max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2">
                        <div>
                          <p className="text-sm font-medium text-white/80 max-[600px]:text-xs">Produto interessado:</p>
                          <p className="font-semibold text-white max-[600px]:text-sm">{message.product.title}</p>
                        </div>
                        <Link 
                          href={`/anuncio/${message.product.id}`}
                          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors max-[600px]:text-xs max-[600px]:self-end"
                        >
                          Ver anúncio
                          <ExternalLink className="h-3 w-3 max-[600px]:h-2 max-[600px]:w-2" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Conteúdo da mensagem */}
                  <div className="mb-4 max-[600px]:mb-3">
                    <p className="text-sm font-medium text-white/80 mb-2 max-[600px]:text-xs max-[600px]:mb-1">Mensagem:</p>
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-[600px]:p-3">
                      <p className="text-white whitespace-pre-wrap max-[600px]:text-sm" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', lineHeight: '1.5' }}>{message.message_content}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end gap-3 max-[600px]:flex-col max-[600px]:gap-2">
                    {!message.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={markingRead === message.id}
                        className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10 backdrop-blur-sm max-[600px]:w-full max-[600px]:text-xs"
                      >
                        {markingRead === message.id ? 'Marcando...' : 'Marcar como lida'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      asChild
                      className="bg-green-600/80 hover:bg-green-700/80 backdrop-blur-sm max-[600px]:w-full max-[600px]:text-xs"
                    >
                      <Link 
                        href={`https://wa.me/55${message.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(message.full_name)}, recebi sua mensagem sobre ${encodeURIComponent(message.product?.title || 'o produto')}!`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Responder no WhatsApp
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}