# 🚀 Deployment Guide

## 1. Backend & Database (Render)

We use a **Render Blueprint** (`render.yaml`) to automatically provision the PostgreSQL database and Node.js backend service.

1.  Push your code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Blueprint**.
4.  Connect your repository.
5.  Render will detect `render.yaml` and prompt you to apply it.
6.  Click **Apply**.
    - This will create a Database (`task-manager-db`) and a Web Service (`task-manager-backend`).
    - It may take a few minutes to build.
7.  **IMPORTANT**: Once deployed, copy the **Backend URL** (e.g., `https://task-manager-backend.onrender.com`).

## 2. Frontend (Vercel)

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    - **Root Directory**: Click "Edit" and select `frontend`.
    - **Environment Variables**:
        - `VITE_API_URL`: Paste the **Backend URL** from Render (e.g., `https://task-manager-backend.onrender.com`).
5.  Click **Deploy**.
6.  Once deployed, copy the **Frontend URL** (e.g., `https://task-manager-frontend.vercel.app`).

## 3. Final Configuration (Link them together)

Now that both are deployed, you need to tell the Backend to allow requests from the Frontend (CORS).

1.  Go back to your **Render Dashboard**.
2.  Select the `task-manager-backend` service.
3.  Go to **Environment**.
4.  Edit the `CLIENT_URL` variable.
5.  Set it to your **Frontend URL** (e.g., `https://task-manager-frontend.vercel.app`).
6.  **Save Changes**. Render will automatically redeploy the backend.

## ✅ Verification
- Open your Vercel URL.
- Try to Register/Login.
- If successful, your full-stack app is live!
