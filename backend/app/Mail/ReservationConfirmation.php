<?php

namespace App\Mail;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public Commande $commande;

    public function __construct(Commande $commande)
    {
        $this->commande = $commande;
    }

    public function build(): self
    {
        return $this
            ->subject('Confirmation de réservation - Musée')
            ->view('emails.reservation_confirmation')
            ->with([
                'commande' => $this->commande,
            ]);
    }
}


