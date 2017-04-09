package com.afklm.arianetest;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.PowerManager;
import android.os.Vibrator;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.google.firebase.iid.FirebaseInstanceId;

public class HomeActivity extends AppCompatActivity {

    SharedPreferences notificationPreferences;
    SharedPreferences.OnSharedPreferenceChangeListener notificationListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        String currentToken = FirebaseInstanceId.getInstance().getToken();
        Log.i("ARIANEFIREBASE", "current token: " + currentToken);

        notificationPreferences = getSharedPreferences(ArianePushMessagingService.PUSH_LAST_PREFERENCE, Context.MODE_PRIVATE);
        notificationListener = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
                if (notificationPreferences.getAll().size() > 0) {
                    testPushReceived();
                }
            }
        };
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_home, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_test_vibrator) {
            testVibrator();
            return true;
        }
        if (id == R.id.action_test_notification) {
            testNotification();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
    }

    @Override
    protected void onResume() {
        super.onResume();

        // Notification has been received when app was inactive
        if (notificationPreferences.getAll().size() > 0) {
            testPushReceived();
        }

        notificationPreferences.registerOnSharedPreferenceChangeListener(notificationListener);
    }

    @Override
    protected void onPause() {
        notificationPreferences.unregisterOnSharedPreferenceChangeListener(notificationListener);

        super.onPause();

        ActivityManager activityManager = (ActivityManager) getApplicationContext()
                .getSystemService(Context.ACTIVITY_SERVICE);

        activityManager.moveTaskToFront(getTaskId(), 0);

        Log.i("LOCKDOWN", "App has been put back to front");
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_POWER
                || event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_UP) {
            Intent closeDialog = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
            sendBroadcast(closeDialog);
            return true;
        }

        return super.dispatchKeyEvent(event);
    }

    /* ACTION METHODS */

    public void testVibrator() {
        Vibrator v = (Vibrator) this.getSystemService(Context.VIBRATOR_SERVICE);
        v.vibrate(new long[] { 0, 1000, 500, 1000, 500, 1000 }, -1);
    }

    public void testNotification() {
        try {
            Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
            r.play();
        } catch (Exception e) {
            Log.e("NOTIFICATION", "Unable to play ringtone", e);
        }
    }

    public void testPushReceived() {

        PowerManager powerManager = (PowerManager)getSystemService(POWER_SERVICE);
        PowerManager.WakeLock wakeUp = powerManager.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP, "ARIANE_WAKEUP");

        wakeUp.acquire();

        testNotification();
        testVibrator();

        Snackbar.make(findViewById(R.id.homeMainView), notificationPreferences.getString("flightNumber", "test"), Snackbar.LENGTH_LONG).show();

        wakeUp.release();

        notificationPreferences.edit().clear().commit();
    }
}
