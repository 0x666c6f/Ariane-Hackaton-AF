package com.afklm.ariane;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

/**
 * Created by Selim on 09/04/2017.
 */

public class ArianePushMessagingService extends FirebaseMessagingService {

    public static final String PUSH_SERVICE = "com.afklm.ariane.push";
    public static final String PUSH_LAST_PREFERENCE = "com.afklm.ariane.push.last_push_data_preference";
    public static final String PUSH_FLIGHTNUMBER = "com.afklm.ariane.push.flightNumber";

    @Override
    public void onCreate() {
        super.onCreate();

        String currentToken = FirebaseInstanceId.getInstance().getToken();
        Log.i("ARIANEFIREBASE", "current token: " + currentToken);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

        Log.i("ARIANEFIREBASE", "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.i("ARIANEFIREBASE", "Message data payload: " + remoteMessage.getData());

            SharedPreferences sp = getSharedPreferences(PUSH_LAST_PREFERENCE, Context.MODE_PRIVATE);

            SharedPreferences.Editor editor = sp.edit();
            for (Map.Entry<String, String> entry : remoteMessage.getData().entrySet()) {
                editor.putString(entry.getKey(), entry.getValue());
            }
            editor.apply();

            Intent launchAppIntent = new Intent(this, HomeActivity.class);
            launchAppIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(launchAppIntent);
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.i("ARIANEFIREBASE", "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }
    }

}
