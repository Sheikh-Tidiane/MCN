<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmation de réservation</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 16px; }
        .header { color: #2C3E50; }
        .box { background: #f7f7f7; padding: 12px; border-radius: 8px; }
    </style>
    </head>
<body>
    <div class="container">
        <h1 class="header">Votre réservation a été enregistrée</h1>
        <p>Bonjour {{ data_get($commande, 'donnees_facturation.prenom') }} {{ data_get($commande, 'donnees_facturation.nom') }},</p>
        <p>Nous avons bien reçu votre réservation. Vous avez choisi de payer sur place.</p>
        <div class="box">
            <p><strong>Numéro de commande:</strong> {{ $commande->numero_commande }}</p>
            <p><strong>Montant total:</strong> {{ number_format($commande->montant_total, 0, ',', ' ') }} FCFA</p>
        </div>
        <p>Votre e-ticket (PDF avec QR code) vous sera envoyé après paiement à l'accueil du musée.</p>
        <p>Merci et à bientôt,</p>
        <p>Musée des Civilisations Noires</p>
    </div>
</body>
</html>


