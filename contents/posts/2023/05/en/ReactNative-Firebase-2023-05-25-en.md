---
author: millo
title: "[React Native] Install @react-native-firebase (solve pod install issue)"
category: reactnative
layout: post
released_at: 2023-05-25 15:30
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: en
tags:
    - ReactNative
    - Firebase
    - "@react-native-firebase"
is_private: false
translation: /ReactNative-Firebase-2023-05-25/
translation_series:
description: Solving react-native-firebase pod install issue.
---

## 1. Introduction

I write this article to summarize how I solved the issue that occurred while setting react-native-firebase to the latest version.

## 2. Installation

You can proceed with the installation method as shown on [the official site](https://rnfirebase.io/).

### [👋 Wait] Version Info

> react-native 0.71.8 <br />
> @react-native-firebase/app 17.5.0 <br />

## 3. Solution

According to [the official site](https://rnfirebase.io/), beginning with firebase-ios-sdk v9+ (react-native-firebase v15+) you must tell CocoaPods to use frameworks.
Strangely, however, errors continue to occur even if you do what the official site tells you to do.

The solution is to add the following code to the `ios/Podfile` file.

```diff
## Podfile
  
## ...

target '{your project name}' do
  config = use_native_modules!

+  ## firebase
+  use_frameworks! :linkage => :static
+  $RNFirebaseAsStaticFramework = true

  ## Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => config[:reactNativePath],
    ## Hermes is now enabled by default. Disable by setting this flag to false.
    ## Upcoming versions of React Native may rely on get_default_flags(), but
    ## we make it explicit here to aid in the React Native upgrade process.
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    ## Enables Flipper.
    #
    ## Note that if you have use_frameworks! enabled, Flipper will not work and
    ## you should disable the next line.
-    :flipper_configuration => flipper_config,
+    :flipper_configuration => FlipperConfiguration.disabled, ## firebase
    ## An absolute path to your application rosot.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target '{your project name}Tests' do
    inherit! :complete
    ## Pods for testing
  end

  post_install do |installer|
    react_native_post_install(
      installer,
      ## Set `mac_catalyst_enabled` to `true` in order to apply patches
      ## necessary for Mac Catalyst builds
      :mac_catalyst_enabled => false
    )
    __apply_Xcode_12_5_M1_post_install_workaround(installer)

+    ## for Firebase (all below)
+    installer.pods_project.targets.each do |target|
+      target.build_configurations.each do |config|
+        config.build_settings["GCC_WARN_INHIBIT_ALL_WARNINGS"] = "YES"
+      end
+    end

+    installer.pods_project.targets.each do |target|
+      target.build_configurations.each do |config|
+        config.build_settings["CC"] = "clang"
+        config.build_settings["LD"] = "clang"
+        config.build_settings["CXX"] = "clang++"
+        config.build_settings["LDPLUSPLUS"] = "clang++"
+      end
+    end

+    installer.aggregate_targets.each do |aggregate_target|
+      aggregate_target.user_project.native_targets.each do |target|
+        target.build_configurations.each do |config|
+          config.build_settings['ONLY_ACTIVE_ARCH'] = 'YES'
+          config.build_settings['EXCLUDED_ARCHS'] = 'i386'
+        end
+      end
+      aggregate_target.user_project.save
+    end

+    installer.pods_project.targets.each do |target|
+      if (target.name.eql?('FBReactNativeSpec'))
+        target.build_phases.each do |build_phase|
+          if (build_phase.respond_to?(:name) && build_phase.name.eql?('[CP-User] Generate Specs'))
+            target.build_phases.move(build_phase, 0)
+          end
+        end
+      end
+    end

+    installer.pods_project.targets.each do |target|
+      target.build_configurations.each do |config|
+        config.build_settings["ENABLE_BITCODE"] = "NO"
+      end
+    end
  end
end

```