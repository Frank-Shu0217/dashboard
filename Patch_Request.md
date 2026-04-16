* Password visibility toggle

The login password field shall include a show/hide control represented by an eye icon. By default, the password shall be masked. Activating the control shall toggle the field between masked and visible text without changing the underlying value. The control shall be accessible by keyboard and screen reader, and the password value shall never be logged or stored due to this feature.

* Remember user ID

The login form may provide a “Remember user ID” option. When selected, the application shall store the user ID locally on the current device and prefill it on future visits. The remembered value shall remain editable and removable by the user.

* Password persistence

The application shall not implement custom storage of the user’s raw password in browser-managed application storage. Instead, the login form shall support standard browser and password-manager autofill using appropriate form structure and autocomplete attributes such as username and current-password.