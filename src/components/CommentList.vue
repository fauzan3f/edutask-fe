<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { commentService } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  taskId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['comment-added', 'comment-updated', 'comment-deleted']);

const authStore = useAuthStore();
const comments = ref([]);
const newComment = ref('');
const isLoading = ref(false);
const error = ref('');
const isSubmitting = ref(false);

// Fetch comments
const fetchComments = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await commentService.getTaskComments(props.taskId);
    comments.value = response.data.data || [];
  } catch (err) {
    console.error('Error fetching comments:', err);
    error.value = 'Failed to load comments';
  } finally {
    isLoading.value = false;
  }
};

// Add comment
const addComment = async () => {
  if (!newComment.value.trim()) return;
  
  isSubmitting.value = true;
  
  try {
    const response = await commentService.create({
      task_id: props.taskId,
      content: newComment.value
    });
    
    // Add to the comments list
    const addedComment = response.data.data;
    comments.value.push(addedComment);
    
    // Emit event
    emit('comment-added', addedComment);
    
    // Clear input
    newComment.value = '';
  } catch (err) {
    console.error('Error adding comment:', err);
    error.value = 'Failed to add comment';
  } finally {
    isSubmitting.value = false;
  }
};

// Edit comment (to be implemented)
const editComment = (commentId) => {
  // Implementation for editing comment
};

// Delete comment
const deleteComment = async (commentId) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  
  try {
    await commentService.delete(commentId);
    
    // Remove from the comments list
    comments.value = comments.value.filter(c => c.id !== commentId);
    
    // Emit event
    emit('comment-deleted', commentId);
  } catch (err) {
    console.error('Error deleting comment:', err);
    error.value = 'Failed to delete comment';
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <div class="comments-container">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Comments</h3>
    
    <!-- Error message -->
    <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-md mb-4">
      {{ error }}
      <button @click="fetchComments" class="text-red-700 font-medium ml-2">Retry</button>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Comment list -->
    <div v-else>
      <div v-if="comments.length === 0" class="text-gray-500 text-center py-4">
        No comments yet. Be the first to comment!
      </div>
      
      <ul v-else class="space-y-4">
        <li v-for="comment in comments" :key="comment.id" class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">{{ comment.user?.name?.charAt(0) || 'U' }}</span>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-medium text-gray-900">{{ comment.user?.name || 'Unknown User' }}</h4>
                <div class="flex items-center">
                  <span class="text-xs text-gray-500 mr-2">{{ formatDate(comment.created_at) }}</span>
                  <button 
                    v-if="authStore.user?.id === comment.user_id || authStore.isAdmin || authStore.isProjectManager"
                    @click="deleteComment(comment.id)"
                    class="text-red-600 hover:text-red-800 text-xs"
                    title="Delete comment"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ comment.content }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- Add comment form -->
    <div class="mt-6">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Add Comment</h4>
      <div class="flex">
        <textarea 
          v-model="newComment" 
          class="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Write your comment here..."
          rows="2"
        ></textarea>
        <button 
          @click="addComment" 
          class="bg-primary text-white px-4 rounded-r-md hover:bg-primary-dark disabled:opacity-50"
          :disabled="isSubmitting || !newComment.trim()"
        >
          <span v-if="isSubmitting">...</span>
          <span v-else>Send</span>
        </button>
      </div>
    </div>
  </div>
</template> 