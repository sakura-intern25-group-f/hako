import { Octokit } from "@octokit/rest";
import sodium from "libsodium-wrappers";

export const createSecret = async (
  octkit: Octokit,
  owner: string,
  repo: string,
  secret_name: string,
  secret: string,
) => {
  await sodium.ready;
  const key_resp = await octkit.rest.actions.getRepoPublicKey({ owner, repo });
  const key_id = key_resp.data.key_id;
  const pub_key = key_resp.data.key;
  const encrypted_value = sodium.crypto_box_seal(
    sodium.from_string(secret),
    sodium.from_base64(pub_key, sodium.base64_variants.ORIGINAL),
  );
  await octkit.rest.actions.createOrUpdateRepoSecret({
    owner,
    repo,
    secret_name,
    key_id,
    encrypted_value: sodium.to_base64(
      encrypted_value,
      sodium.base64_variants.ORIGINAL,
    ),
  });
};
