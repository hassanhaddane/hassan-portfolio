# Configuration de l'envoi d'emails

## Étapes pour configurer Resend

1. **Créer un compte Resend**
   - Va sur [resend.com](https://resend.com)
   - Crée un compte gratuit (10 000 emails/mois)

2. **Configurer ton domaine (optionnel mais recommandé)**
   - Dans le dashboard Resend, va dans "Domains"
   - Ajoute ton domaine `lowkyz.xyz`
   - Configure les enregistrements DNS selon les instructions

3. **Obtenir ta clé API**
   - Va dans "API Keys" dans le dashboard
   - Crée une nouvelle clé API
   - Copie la clé (commence par `re_`)

4. **Configuration locale**
   - Ouvre le fichier `.env.local`
   - Remplace `your_resend_api_key_here` par ta vraie clé API

5. **Test**
   - Redémarre ton serveur de développement (`pnpm dev`)
   - Teste le formulaire de contact

## Configuration de production

Pour Vercel (ou autre plateforme) :
- Ajoute la variable d'environnement `RESEND_API_KEY` dans les paramètres de ton projet
- Redéploie l'application

## Domaine d'envoi

Actuellement configuré pour envoyer depuis `noreply@lowkyz.xyz`.
Si tu n'as pas configuré le domaine dans Resend, change la ligne dans `app/api/contact/route.ts` :

```typescript
from: "Portfolio Contact <noreply@lowkyz.xyz>", // Remplace par ton domaine vérifié
```

Par défaut, tu peux utiliser : `from: "onboarding@resend.dev"`